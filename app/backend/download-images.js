import axios from "axios";
import fs from "fs";
import path from "path";

const imagesDir = path.join(process.cwd(), "../public/images");

export async function downloadImage(fileId, clubName) {
  if (!fileId) return;

  fs.mkdirSync(imagesDir, { recursive: true });

  const filename = `${clubName.replace(/\s+/g, "_")}.png`;
  const filePath = path.join(imagesDir, filename);

  if (fs.existsSync(filePath)) return;

  try {
    const response = await axios({
      url: `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`,
      method: "GET",
      responseType: "stream",
      maxRedirects: 5,
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`✅ Downloaded image for ${clubName}`);
  } catch (err) {
    console.error(`❌ Failed to download image for ${clubName}:`, err.message);
  }
}