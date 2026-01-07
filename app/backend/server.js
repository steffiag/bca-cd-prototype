import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupAuth from "./auth.js";
import db from "./models/index.js";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

setupAuth(app);

app.get("/", (req, res) => {
  res.send("BCA Club Dashboard backend is running!");
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
