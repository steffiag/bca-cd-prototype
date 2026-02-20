import { google } from "googleapis";
import path from "path";
import "dotenv/config";

const keyFile = process.env.GOOGLE_CREDS_PATH;

const auth = new google.auth.GoogleAuth({
  keyFile,
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

const TEST_FORM_ID = "1a7PoNfDMwsEwFasPrA_6k8Fti4__E11xC32Eanchcc8";

async function test() {
  const responses = await getFormResponses(TEST_FORM_ID);
  console.log(JSON.stringify(responses, null, 2));
}

test();