import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";
import { getFormResponses } from "./google-forms.js";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import stringSimilarity from 'string-similarity';

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
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET); // testing if form.credentials.json is working

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

setupAuth(app);

app.get("/", (req, res) => {
  res.send("BCA Club Dashboard backend is running!");
});


app.get("/teacher-availability", async (req, res) => {
  try {
    const responses = await getFormResponses("1E9oTtJjWJhoCKBT69Vx_nEj664jMfQn0cvgWQoF4vyY");
    console.log(JSON.stringify(responses, null, 2));
    const teachers = responses.map((resp) => {
      const answers = resp.answers;
      return {
        name: answers["2f647977"]?.textAnswers.answers[0].value || "",
        email: answers["53dcbc10"]?.textAnswers.answers[0].value || "",
        room: answers["38b6b35f"]?.textAnswers.answers[0].value || "",
        available: answers["0f394b75"]?.textAnswers.answers[0].value || "No",
        department: answers["66644a8c"]?.textAnswers.answers[0].value || "",
        assigned: answers["3819750e"]?.textAnswers.answers[0].value || "",
      };
    });

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teacher availability" });
  }
});

// DELETE endpoint - add this BEFORE the GET endpoint
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

// GET endpoint
app.get("/wednesday-club", async (req, res) => {
  try {
    // Get clubs from Google Forms
    const responses = await getFormResponses(
      "1a7PoNfDMwsEwFasPrA_6k8Fti4__E11xC32Eanchcc8"
    );
    console.log(JSON.stringify(responses, null, 2));
    
    const formClubs = responses.map((resp) => {
      const answers = resp.answers;
      const membersRaw = answers["1341f104"]?.textAnswers.answers[0].value || "";
      const hasFiveMembers = membersRaw.trim().toLowerCase() !== "n/a";
      return {
        club: answers["58d95ef3"]?.textAnswers.answers[0].value || "",
        email: answers["6bdbdc40"]?.textAnswers.answers[0].value || "",
        category: answers["58e9aaf9"]?.textAnswers.answers[0].value || "",
        advisor: answers["5573285b"]?.textAnswers.answers[0].value || "",
        room: answers["0478ecea"]?.textAnswers.answers[0].value || "",
        members: hasFiveMembers ? "Yes" : "No",
        membersRaw: membersRaw,                         
        req_advisor: (answers["3489c0db"]?.textAnswers.answers[0].value || "") + "?",         
        status: "Pending",
        source: "google_form",
      };
    });

    // Get manually added clubs from database
    const dbClubs = await db.WednesdayClub.findAll();
    const manualClubs = dbClubs.map((club) => ({
      club: club.club_name,
      email: club.leader_email,
      category: club.category,
      advisor: club.advisor,
      room: club.room,
      members: club.members_raw.split(",").filter(Boolean).length >= 5 ? "Yes" : "No",
      membersRaw: club.members_raw,
      req_advisor: "",
      status: club.status,
      source: "manual",
      dbId: club.id,
    }));

    // Combine both sources
    const allClubs = [...manualClubs, ...formClubs];
    res.json(allClubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Wednesday club proposals" });
  }
});

// POST endpoint
app.post("/wednesday-club", async (req, res) => {
  try {
    const { club, email, category, advisor, room, members, status } = req.body;
    
    const newClub = await db.WednesdayClub.create({
      club_name: club,
      leader_email: email,
      category: category,
      advisor: advisor,
      room: room,
      members_raw: members,
      status: status || "Pending",
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
    
    // Try to delete by ID first (if identifier is a number), otherwise by email
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
    // Get clubs from Google Forms
    const responses = await getFormResponses(
      "1fvK9FLMsuwixNsDF6vbG37H_IFpm-Kh7aTnYwKdgYCM"
    );
    console.log(JSON.stringify(responses, null, 2));
    
    const formClubs = responses.map((resp) => {
      const answers = resp.answers;
      const membersRaw = answers["1341f104"]?.textAnswers.answers[0].value || "";
      const hasFiveMembers = membersRaw.trim().toLowerCase() !== "n/a";
      return {
        club: answers["58d95ef3"]?.textAnswers.answers[0].value || "",
        email: answers["6bdbdc40"]?.textAnswers.answers[0].value || "",
        category: answers["58e9aaf9"]?.textAnswers.answers[0].value || "",
        advisor: answers["5573285b"]?.textAnswers.answers[0].value || "",
        room: answers["0478ecea"]?.textAnswers.answers[0].value || "",
        day: answers["33d1d5a4"]?.textAnswers.answers[0].value || "",
        time: answers["21c77a77"]?.textAnswers.answers[0].value || "",
        members: hasFiveMembers ? "Yes" : "No",
        membersRaw: membersRaw,               
        req_advisor: (answers["3489c0db"]?.textAnswers.answers[0].value || "") + "?",         
        status: "Pending",
        merge: "No",
        source: "google_form",
      };
    });

    // Get manually added clubs from database
    const dbClubs = await db.MorningClub.findAll();
    const manualClubs = dbClubs.map((club) => ({
      club: club.club_name,
      email: club.leader_email,
      category: club.category,
      advisor: club.advisor,
      room: club.room,
      day: club.day,
      time: club.time,
      members: club.members_raw.split(",").filter(Boolean).length >= 5 ? "Yes" : "No",
      membersRaw: club.members_raw,
      req_advisor: "",
      status: club.status,
      merge: club.merge,
      source: "manual",
      dbId: club.id, // Keep track of database ID
    }));

    // Combine both sources
    const allClubs = [...manualClubs, ...formClubs];
    res.json(allClubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Morning club proposals" });
  }
});

app.post("/morning-club", async (req, res) => {
  try {
    const { club, email, category, advisor, room, day, time, members, status, merge } = req.body;
    
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
      source: "manual",
    });

    console.log("New club created:", newClub);
    res.json({ success: true, club: newClub });
  } catch (err) {
    console.error("Error saving club:", err);
    res.status(500).json({ error: err.message });
  }
});


// Route to fetch morning clubs for AI merge
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



db.sequelize
  .sync()
  .then(() => {
    console.log("Sequelize synced");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch(console.error);

//ai merge suggestions
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

    //compares each pair of clubs
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

