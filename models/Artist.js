import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String },
  genre: { type: String }
});

export default mongoose.model("Artist", ArtistSchema);
