import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";
import { getFormResponses } from "./google-forms.js";

dotenv.config();

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




app.get("/ai-merges", async (req, res) => {
  try {
    const responses = await getFormResponses(
      "1fvK9FLMsuwixNsDF6vbG37H_IFpm-Kh7aTnYwKdgYCM"
    );
    console.log(JSON.stringify(responses, null, 2));
    const merge = responses.map((resp) => {
      const answers = resp.answers;
      return {
        club: answers["58d95ef3"]?.textAnswers.answers[0].value || "",
        mission: answers["76676db8"]?.textAnswers.answers[0].value || "",
      };
    });
    res.json(merge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch club proposals", });
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
