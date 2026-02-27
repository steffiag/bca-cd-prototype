import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";
import { getFormResponses } from "./google-forms.js";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import stringSimilarity from 'string-similarity';
import { downloadImage } from "./download-images.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//calculates similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

dotenv.config();

//const openai = new OpenAI({
//  apiKey: OPENAI_API_KEY,
//});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

setupAuth(app);

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload-club-image/:clubName", upload.single("image"), (req, res) => {
  try {
    const safeName = req.params.clubName;
    const filePath = path.join(process.cwd(), "../public/images", `${safeName}.png`);
    fs.writeFileSync(filePath, req.file.buffer);
    res.json({ success: true, filename: `${safeName}.png` });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: err.message });
  }
});
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("BCA Club Dashboard backend is running!");
});

// ============================================
// TEACHER AVAILABILITY ENDPOINTS
// ============================================

// Sync teachers from Google Forms
async function syncTeachers() {
  const responses = await getFormResponses("1E9oTtJjWJhoCKBT69Vx_nEj664jMfQn0cvgWQoF4vyY");
  
  for (const resp of responses) {
    const responseId = resp.responseId;
    const exists = await db.Teacher.findOne({ where: { form_response_id: responseId } });
    if (exists) continue;

    const answers = resp.answers;
    await db.Teacher.create({
      form_response_id: responseId,
      name: answers["2f647977"]?.textAnswers.answers[0].value || "",
      email: answers["53dcbc10"]?.textAnswers.answers[0].value || "",
      room: answers["38b6b35f"]?.textAnswers.answers[0].value || "",
      available: answers["0f394b75"]?.textAnswers.answers[0].value === "Yes",
      department: answers["66644a8c"]?.textAnswers.answers[0].value || "",
      assigned_club: answers["3819750e"]?.textAnswers.answers[0].value || null,
      source: "google_form",
    });
  }
}

// GET all teachers
app.get("/teacher-availability", async (req, res) => {
  try {
    await syncTeachers();

    const dbTeachers = await db.Teacher.findAll();

    // Get all approved clubs for the dropdown
    const wednesdayClubs = await db.WednesdayClub.findAll({
      where: { status: "Approved" },
    });

    const teachers = dbTeachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      room: teacher.room,
      available: teacher.available ? "Yes" : "No",
      availableBool: teacher.available,
      department: teacher.department,
      assigned: teacher.assigned_club,
      source: teacher.source,
      availableClubs: wednesdayClubs.map((c) => c.club_name),
    }));

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teacher availability" });
  }
});

// POST new teacher (manual entry)
app.post("/teacher-availability", async (req, res) => {
  try {
    const { name, email, room, available, department, assigned_club } = req.body;
    
    const newTeacher = await db.Teacher.create({
      name,
      email,
      room,
      available: available === "Yes" || available === true,
      department,
      assigned_club: assigned_club || null,
      source: "manual",
    });

    res.json({ success: true, teacher: newTeacher });
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update teacher
app.put("/teacher-availability/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, room, available, department, assigned_club } = req.body;

    const teacher = await db.Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    await teacher.update({
      name,
      email,
      room,
      available: available === "Yes" || available === true,
      department,
      assigned_club: assigned_club || null,
    });

    res.json({ success: true, teacher });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update teacher availability (for teachers confirming themselves)
app.put("/teacher-availability/:id/confirm", async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const teacher = await db.Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    await teacher.update({
      available: available === true || available === "Yes",
    });

    res.json({ success: true, teacher });
  } catch (err) {
    console.error("Error confirming availability:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE teacher
app.delete("/teacher-availability/:id/:source", async (req, res) => {
  try {
    const { id, source } = req.params;
    
    if (source === "google_form") {
      return res.status(400).json({ 
        error: "Cannot delete teachers from Google Forms. These must be managed through Google Forms." 
      });
    }

    const deleted = await db.Teacher.destroy({ where: { id: parseInt(id) } });

    if (deleted) {
      res.json({ success: true, message: "Teacher deleted" });
    } else {
      res.status(404).json({ error: "Teacher not found" });
    }
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// EXISTING ENDPOINTS (Wednesday Clubs, etc.)
// ============================================

app.delete("/wednesday-club/:identifier/:source", async (req, res) => {
  try {
    const { identifier, source } = req.params;
    console.log("Delete Wednesday club request:", { identifier, source });
    
    if (source === "google_form") {
      return res.status(400).json({ 
        error: "Cannot delete clubs from Google Forms. These must be managed through Google Forms." 
      });
    }

    const whereClause = isNaN(identifier) 
      ? { leader_email: identifier }
      : { id: parseInt(identifier) };
    
    const deleted = await db.WednesdayClub.destroy({ where: whereClause });

    if (deleted) {
      res.json({ success: true, message: "Club deleted" });
    } else {
      res.status(404).json({ error: "Club not found in database" });
    }
  } catch (err) {
    console.error("Error deleting Wednesday club:", err);
    res.status(500).json({ error: err.message });
  }
});

async function syncWednesdayClubs() {
  const responses = await getFormResponses(
    "1a7PoNfDMwsEwFasPrA_6k8Fti4__E11xC32Eanchcc8"
  );
  for (const resp of responses) {
    const responseId = resp.responseId;
    const exists = await db.WednesdayClub.findOne({
      where: { form_response_id: responseId },
    });
    const answers = resp.answers;
    if (exists) {
      const formMission =
        answers["5967c5af"]?.textAnswers?.answers?.[0]?.value;
      const formPhoto =
        answers["643764f9"]?.fileUploadAnswers?.answers?.[0]?.fileId;

      const updates = {};
      if (formPhoto) updates.photo_file_id = formPhoto;
      if (formMission && !exists.mission) updates.mission = formMission;

      if (Object.keys(updates).length > 0) {
        await exists.update(updates);
      }
      continue;
    }
    const newClub = await db.WednesdayClub.create({
      form_response_id: responseId,
      club_name:
        answers["58d95ef3"]?.textAnswers?.answers?.[0]?.value || "",
      mission:
        answers["5967c5af"]?.textAnswers?.answers?.[0]?.value || "",
      leader_email:
        answers["6bdbdc40"]?.textAnswers?.answers?.[0]?.value || "",
      category:
        answers["58e9aaf9"]?.textAnswers?.answers?.[0]?.value || "",
      advisor:
        answers["5573285b"]?.textAnswers?.answers?.[0]?.value || "",
      room:
        answers["0478ecea"]?.textAnswers?.answers?.[0]?.value || "",
      day:
        answers["33d1d5a4"]?.textAnswers?.answers?.[0]?.value || "",
      time:
        answers["21c77a77"]?.textAnswers?.answers?.[0]?.value || "",
      members_raw:
        answers["1341f104"]?.textAnswers?.answers?.[0]?.value || "",
      photo_file_id:
        answers["643764f9"]?.fileUploadAnswers?.answers?.[0]?.fileId || "",
      status: "Pending",
      merge: "No",
      source: "google_form",
    });
    if (newClub.photo_file_id) {
      downloadImage(newClub.photo_file_id, newClub.club_name);
    }
  }
}

app.get("/wednesday-club", async (req, res) => {
  try {
    await syncWednesdayClubs();

    const dbClubs = await db.WednesdayClub.findAll();

    const clubs = dbClubs.map((club) => ({
      dbId: club.id,
      club: club.club_name,
      email: club.leader_email,
      category: club.category,
      advisor: club.advisor,
      room: club.room,
      membersRaw: club.members_raw,
      members: club.members_raw.split(",").filter(Boolean).length >= 5 ? "Yes" : "No",
      status: club.status,
      source: club.source,
      mission: club.mission || "",
    }));

    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Wednesday club proposals" });
  }
});

app.post("/wednesday-club", async (req, res) => {
  try {
    const { club, email, category, advisor, room, members, status, mission } = req.body;
    
    const newClub = await db.WednesdayClub.create({
      club_name: club,
      leader_email: email,
      category: category,
      advisor: advisor,
      room: room,
      members_raw: members,
      status: status || "Pending",
      mission: mission || "",
      source: "manual",
    });

    console.log("New Wednesday club created:", newClub);
    res.json({ success: true, club: newClub });
  } catch (err) {
    console.error("Error saving Wednesday club:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/morning-club/:identifier/:source", async (req, res) => {
  try {
    const { identifier, source } = req.params;
    console.log("Delete request received:", { identifier, source });
    
    if (source === "google_form") {
      console.log("Cannot delete Google Form club");
      return res.status(400).json({ 
        error: "Cannot delete clubs from Google Forms. These must be managed through Google Forms." 
      });
    }

    console.log("Attempting to delete club with identifier:", identifier);
    
    const whereClause = isNaN(identifier) 
      ? { leader_email: identifier }
      : { id: parseInt(identifier) };
    
    const deleted = await db.MorningClub.destroy({ where: whereClause });

    console.log("Rows deleted:", deleted);

    if (deleted) {
      res.json({ success: true, message: "Club deleted" });
    } else {
      res.status(404).json({ error: "Club not found in database" });
    }
  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/morning-club", async (req, res) => {
  try {
    await syncMorningClubs();

    const dbClubs = await db.MorningClub.findAll();

    const clubs = dbClubs.map((club) => ({
      dbId: club.id,
      club: club.club_name,
      email: club.leader_email,
      category: club.category,
      advisor: club.advisor,
      room: club.room,
      day: club.day,
      time: club.time,
      membersRaw: club.members_raw,
      members: club.members_raw.split(",").filter(Boolean).length >= 5 ? "Yes" : "No",
      status: club.status,
      merge: club.merge,
      source: club.source,
      mission: club.mission || "",
    }));

    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Morning club proposals" });
  }
});

app.post("/morning-club", async (req, res) => {
  try {
    const { club, email, category, advisor, room, day, time, members, status, merge, mission } = req.body;
    
    const newClub = await db.MorningClub.create({
      club_name: club,
      leader_email: email,
      category: category,
      advisor: advisor,
      room: room,
      day: day,
      time: time,
      members_raw: members,
      status: status || "Pending",
      merge: merge || "No",
      mission: mission || "",
      source: "manual",
    });

    console.log("New club created:", newClub);
    res.json({ success: true, club: newClub });
  } catch (err) {
    console.error("Error saving Morning club:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/approved-morning-clubs", async (req, res) => {
  try {
    await syncMorningClubs();

    const clubs = await db.MorningClub.findAll({
      where: { status: "Approved" },
      attributes: [
        "id",
        "club_name",
        "mission",
        "photo_file_id",
      ],
    });

    res.json(
      clubs.map(c => ({
        dbId: c.id, 
        club: c.club_name,
        mission: c.mission,
        photo: c.photo_file_id,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch approved morning clubs" });
  }
});

app.get("/approved-wednesday-clubs", async (req, res) => {
  try {
    await syncWednesdayClubs();

    const clubs = await db.WednesdayClub.findAll({
      where: { status: "Approved" },
      attributes: [
        "id",
        "club_name",
        "mission",
        "photo_file_id",
      ],
    });

    res.json(
      clubs.map(c => ({
        dbId: c.id, 
        club: c.club_name,
        mission: c.mission,
        photo: c.photo_file_id,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch approved Wednesday clubs" });
  }
});

app.get("/ai-merges", async (req, res) => {
  try {
    // Get Google Form clubs
    const formResponses = await getFormResponses(
      "1fvK9FLMsuwixNsDF6vbG37H_IFpm-Kh7aTnYwKdgYCM"
    );

    const formClubs = formResponses.map(resp => {
      const answers = resp.answers;
      return {
        club: answers["58d95ef3"]?.textAnswers.answers[0].value?.trim() || "",
        mission: answers["76676db8"]?.textAnswers.answers[0].value?.trim() || "",
        email: answers["6bdbdc40"]?.textAnswers.answers[0].value?.trim() || "",
      };
    });

    // Get manually added clubs from DB
    const dbClubs = await db.MorningClub.findAll();
    const manualClubs = dbClubs.map(club => ({
      club: club.club_name.trim(),
      mission: (club.mission || "").trim(),
      email: club.leader_email.trim(),
    }));

    // Combine both sources
    const allClubs = [...manualClubs, ...formClubs];

    // Deduplicate by club name (keep the first occurrence)
    const seen = new Set();
    const uniqueClubs = allClubs.filter(c => {
      const key = c.club.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log("/ai-merges returning unique clubs:", uniqueClubs);

    res.json(uniqueClubs);
  } catch (err) {
    console.error("Failed to fetch AI merge clubs:", err);
    res.status(500).json({ error: "Failed to fetch AI merge clubs" });
  }
});

app.get("/openai-test", async (req, res) => {
  try {
    console.log("OpenAI test endpoint hit");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Reply with exactly the word CONNECTED." }
      ],
      temperature: 0,
    });

    const reply = completion.choices[0].message.content;

    console.log("OpenAI replied:", reply);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("OpenAI test failed:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

async function syncMorningClubs() {
  const responses = await getFormResponses("1fvK9FLMsuwixNsDF6vbG37H_IFpm-Kh7aTnYwKdgYCM");

  for (const resp of responses) {
    const responseId = resp.responseId;
    const exists = await db.MorningClub.findOne({ where: { form_response_id: responseId } });
    const answers = resp.answers;

    if (exists) {
      const formMission = answers["76676db8"]?.textAnswers?.answers?.[0]?.value;
      const formPhoto = answers["2cbc5d6b"]?.fileUploadAnswers?.answers?.[0]?.fileId;

      const updates = {};
      if (formPhoto) updates.photo_file_id = formPhoto;
      if (formMission && !exists.mission) updates.mission = formMission;
      if (Object.keys(updates).length > 0) await exists.update(updates);
      continue;
    }

    const newClub = await db.MorningClub.create({
      form_response_id: responseId,
      club_name: answers["58d95ef3"]?.textAnswers?.answers?.[0]?.value || "",
      mission: answers["76676db8"]?.textAnswers?.answers?.[0]?.value || "",
      leader_email: answers["6bdbdc40"]?.textAnswers?.answers?.[0]?.value || "",
      category: answers["58e9aaf9"]?.textAnswers?.answers?.[0]?.value || "",
      advisor: answers["5573285b"]?.textAnswers?.answers?.[0]?.value || "",
      room: answers["0478ecea"]?.textAnswers?.answers?.[0]?.value || "",
      day: answers["33d1d5a4"]?.textAnswers?.answers?.[0]?.value || "",
      time: answers["21c77a77"]?.textAnswers?.answers?.[0]?.value || "",
      members_raw: answers["1341f104"]?.textAnswers?.answers?.[0]?.value || "",
      photo_file_id: answers["2cbc5d6b"]?.fileUploadAnswers?.answers?.[0]?.fileId || "",
      status: "Pending",
      merge: "No",
      source: "google_form",
    });

    downloadImage(newClub.photo_file_id, newClub.club_name);
  }
}

app.put("/morning-club/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      club,
      email,
      category,
      advisor,
      room,
      day,
      time,
      members,
      status,
      merge,
      mission,
    } = req.body;

    const clubToUpdate = await db.MorningClub.findByPk(id);
    if (!clubToUpdate) {
      return res.status(404).json({ error: "Club not found" });
    }

    await clubToUpdate.update({
      club_name: club,
      leader_email: email,
      category,
      advisor,
      room,
      day,
      time,
      members_raw: members,
      status,
      merge,
      mission,
    });

    res.json({ success: true, club: clubToUpdate });
  } catch (err) {
    console.error("Error updating club:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/wednesday-club/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { club, email, category, advisor, room, members, status, mission } = req.body;

    const clubToUpdate = await db.WednesdayClub.findByPk(id);
    if (!clubToUpdate) {
      return res.status(404).json({ error: "Club not found" });
    }

    await clubToUpdate.update({
      club_name: club,
      leader_email: email,
      category,
      advisor,
      room,
      members_raw: members,
      status,
      mission,
    });

    res.json({ success: true, club: clubToUpdate });
  } catch (err) {
    console.error("Error updating Wednesday club:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/assess-similarity", async (req, res) => {
  try {
    const morningClubs = req.body;
    console.log("Incoming clubs for AI similarity:", req.body);

    const texts = morningClubs.map(c => `${c.club}: ${c.mission}`);
    console.log("Texts sent to OpenAI:", texts);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    const embeddings = response.data.map(d => d.embedding);
    const suggestions = [];

    for (let i = 0; i < morningClubs.length; i++) {
      for (let j = i + 1; j < morningClubs.length; j++) {
        const score = cosineSimilarity(embeddings[i], embeddings[j]);
        console.log(`Comparing "${morningClubs[i].club}" and "${morningClubs[j].club}" => similarity: ${score}`);
        if (score > 0.7) {
          suggestions.push({
            clubA: morningClubs[i].club,
            emailA: morningClubs[i].email,
            clubB: morningClubs[j].club,
            emailB: morningClubs[j].email,
            suggestion: "Merge suggested",
          });
        }
      }
    }

    if (suggestions.length === 0) {
      return res.json({ message: "No clubs suggested for merge" });
    }

    res.json(suggestions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Similarity check failed" });
  }
});

// Signup Functionality
app.post("/club-enrollments", async (req, res) => {
  try {
    const { user_id, club_id, club_type } = req.body;

// Send merge emails to club admins
app.post('/send-merge-emails', async (req, res) => {
  console.log('/send-merge-emails called');
  const adminEmail = req.body.adminEmail;
  const merges = req.body.merges || [];

  if (!adminEmail || !Array.isArray(merges) || merges.length === 0) {
    console.log('Missing admin email or merges');
    return res.status(400).json({ error: 'Invalid request' });
  }

  for (const merge of merges) {
    const recipients = [];
    if (merge.emailA) recipients.push(merge.emailA);
    if (merge.emailB && merge.emailB !== merge.emailA) recipients.push(merge.emailB);

    if (recipients.length === 0) {
      console.log('Skipping merge: no valid recipient emails', merge);
      continue;
    }

    console.log('Processing merge:', merge, 'Recipients:', recipients);

    try {
      const info = await transporter.sendMail({
        from: adminEmail,
        to: recipients,
        subject: `Merge suggestion: ${merge.clubA} + ${merge.clubB}`,
        text: `Hello!
        After reviewing club proposals, we noticed that your clubs have similar missions and activities. We suggest considering a potential merge to make your efforts even stronger.
        
        Clubs involved:
        - ${merge.clubA}
        - ${merge.clubB}
        
        Both club leaders are cc'd on this email. Please coordinate with each other and let us know what you decide.
        
        Thank you for your collaboration and dedication to your clubs!`
      });
      console.log('Email send result:', info);
    } catch (err) {
      console.error('Email send failed:', err);
    }
  }

  res.json({ status: 'All merges processed' });
});



;
    if (!user_id || !club_id || !club_type) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Look up the actual user record by email
    const user = await db.User.findOne({ where: { usr_email: user_id } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const actualUserId = user.usr_id;

    if (club_type === "wednesday") {
      const existing = await db.ClubEnrollment.findOne({
        where: { user_id: actualUserId, club_type: "wednesday" },
      });
      if (existing) {
        return res.status(400).json({ success: false, error: "Already enrolled in a Wednesday club" });
      }
    }

    const already = await db.ClubEnrollment.findOne({
      where: { user_id: actualUserId, club_id, club_type },
    });
    if (already) {
      return res.status(400).json({ success: false, error: "Already enrolled in this club" });
    }

    const enrollment = await db.ClubEnrollment.create({ user_id: actualUserId, club_id, club_type });

    const ClubModel = club_type === "morning" ? db.MorningClub : db.WednesdayClub;
    const club = await ClubModel.findByPk(club_id);
    const members = club.members_raw ? club.members_raw.split(",") : [];
    if (!club) {
    return res.status(404).json({
      success: false,
      error: "Club not found",
    });
  }
    members.push(actualUserId);
    await club.update({ members_raw: members.join(",") });

    res.json({ success: true, enrollment });
  } catch (err) {
    console.error("Error enrolling in club:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/club-enrollments", async (req, res) => {
  try {
    const { user_id, club_id, club_type } = req.body;

    const user = await db.User.findOne({ where: { usr_email: user_id } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const deleted = await db.ClubEnrollment.destroy({
      where: { user_id: user.usr_id, club_id, club_type },
    });

    if (!deleted) return res.status(404).json({ success: false, error: "Enrollment not found" });

    const ClubModel = club_type === "morning" ? db.MorningClub : db.WednesdayClub;
    const club = await ClubModel.findByPk(club_id);
    const members = club.members_raw 
      ? club.members_raw.split(",").filter(id => id != user.usr_id) 
      : [];
    await club.update({ members_raw: members.join(",") });

    res.json({ success: true, message: "Removed from club" });
  } catch (err) {
    console.error("Error removing from club:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/user-clubs/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Look up user by email
    const user = await db.User.findOne({ where: { usr_email: user_id } });
    if (!user) return res.json({ success: true, enrollments: [] });

    const enrollments = await db.ClubEnrollment.findAll({
      where: { user_id: user.usr_id },
    });

    res.json({ success: true, enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/club/:club_id/members", async (req, res) => {
  try {
    const { club_id } = req.params;
    const club_type = req.query.type; 
    if (!club_type) return res.status(400).json({ success: false, error: "Missing club type" });

    const members = await db.ClubEnrollment.findAll({
      where: { club_id, club_type },
      include: [
        { model: db.User, attributes: ["usr_first_name", "usr_last_name", "usr_email"] },
      ],
    });

    res.json({ success: true, members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Sequelize synced");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch(console.error);
