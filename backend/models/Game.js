import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  genre: { type: [String], default: [] },
  status: { type: String, enum: ["Terminé", "Non terminé", "En cours"], required: true },
  multiplayer: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 10 },
  playtime: { type: Number, default: 0 },
  difficulty: { type: String, enum: ["Facile", "Moyen", "Difficile"] },
  replayability: { type: Number, min: 0, max: 5 },
  summary: { type: String },
  comments: { type: String },
  image: { type: String },
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);
export default Game;
