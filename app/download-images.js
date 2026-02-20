import axios from "axios";
import fs from "fs";
import path from "path";

const endpoints = [
  "http://localhost:4000/approved-morning-clubs",
  "http://localhost:4000/approved-wednesday-clubs"
];

async function downloadImage(fileId, filename) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const filePath = path.join("public/images", filename); 

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function fetchAndDownload() {
  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint, { withCredentials: true });
      const clubs = res.data;

      for (const club of clubs) {
        if (!club.photo) continue;
        const ext = ".png"; 
        const filename = `${club.club.replace(/\s+/g, "_")}${ext}`;
        console.log(`Downloading ${club.club}...`);
        await downloadImage(club.photo, filename);
        console.log(`Saved as ${filename}`);
      }
    } catch (err) {
      console.error("Failed to fetch or download:", err.message);
    }
  }
}

fetchAndDownload();