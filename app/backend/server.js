import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";
import { getFormResponses } from "./google-forms.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});



//calculates similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}


dotenv.config();

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

app.get("/wednesday-club", async (req, res) => {
  try {
    const responses = await getFormResponses(
      "1a7PoNfDMwsEwFasPrA_6k8Fti4__E11xC32Eanchcc8"
    );
    console.log(JSON.stringify(responses, null, 2));
    const wednesday = responses.map((resp) => {
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
      };
    });
    res.json(wednesday);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Wednesday club proposals", });
  }
});

app.get("/morning-club", async (req, res) => {
  try {
    const responses = await getFormResponses(
      "1fvK9FLMsuwixNsDF6vbG37H_IFpm-Kh7aTnYwKdgYCM"
    );
    console.log(JSON.stringify(responses, null, 2));
    const morning = responses.map((resp) => {
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
      };
    });
    res.json(morning);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Morning club proposals", });
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


app.get("/openai-test", async (req, res) => {
  try {
    console.log("🔵 OpenAI test endpoint hit");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Reply with exactly the word CONNECTED." }
      ],
      temperature: 0,
    });

    const reply = completion.choices[0].message.content;

    console.log("🟢 OpenAI replied:", reply);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("🔴 OpenAI test failed:", err);
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
