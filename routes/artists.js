import express from "express";
import Artist from "../models/Artist.js";

const router = express.Router();

// GET - all artists
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - one artist by id
router.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: "artist not found" });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD - new artist
router.post("/", async (req, res) => {
  try {
    const newArtist = new Artist(req.body);
    await newArtist.save();
    res.status(201).json(newArtist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EDIT - artist
router.put("/:id", async (req, res) => {
  try {
    const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - artist
router.delete("/:id", async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: "artist deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
