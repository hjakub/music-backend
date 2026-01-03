import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  album: { type: String },
  genre: { type: String },
  year: { type: Number },
  fileUrl: { type: String }
});

// text index search
SongSchema.index({ title: "text", artist: "text", album: "text" });

export default mongoose.model("Song", SongSchema);
