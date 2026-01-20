import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";
import { getFormResponses } from "./google-forms.js";

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


db.sequelize
  .sync()
  .then(() => {
    console.log("Sequelize synced");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch(console.error);
