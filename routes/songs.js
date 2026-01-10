// routes/songs.js
import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import supabase from "../supabaseClient.js";
import Song from "../models/Song.js";
import Artist from "../models/Artist.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET - all songs
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find().lean();

    const artists = await Artist.find().lean();
    const artistMap = Object.fromEntries(artists.map(a => [a._id.toString(), a.name]));

    const songsWithNames = songs.map(song => ({
      ...song,
      artistName: artistMap[song.artistId?.toString()] || "Unknown Artist"
    }));

    res.json(songsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET - one song by id
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH - songs (text search)
router.get("/search/:query", async (req, res) => {
  try {
    const results = await Song.find({ $text: { $search: req.params.query } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - new song + metadata
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, artistId, album, genre, year } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "no file uploaded" });

    const uniqueName = `${uuidv4()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(uniqueName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("songs")
      .getPublicUrl(uniqueName);

    const fileUrl = publicData.publicUrl;

    const newSong = new Song({
      title,
      artistId,
      album,
      genre,
      year,
      fileUrl,
    });

    await newSong.save();

    res.status(201).json({
      message: "song uploaded successfully",
      song: newSong,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// EDIT - a song
router.put("/:id", async (req, res) => {
  try {
    const updated = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - a song
router.delete("/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "song deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
