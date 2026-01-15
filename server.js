// server.js
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import songRoutes from "./routes/songs.js";
import artistRoutes from "./routes/artists.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/songs", songRoutes);
app.use("/api/artists", artistRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to atlas");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("connection error:", err));
