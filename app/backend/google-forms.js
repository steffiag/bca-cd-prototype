import { google } from "googleapis";
import path from "path";
import "dotenv/config";

const keyFileJson = process.env.GOOGLE_CREDS_JSON;

const auth = new google.auth.GoogleAuth({
  credentials: keyFileJson,
  scopes: ["https://www.googleapis.com/auth/forms.responses.readonly"],
});

const forms = google.forms({ version: "v1", auth });

export async function getFormResponses(formId) {
  try {
    const res = await forms.forms.responses.list({ formId });
    return res.data.responses || [];
  } catch (err) {
    console.error("Error fetching form responses:", err);
    return [];
  }
};
