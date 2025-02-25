import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import gameRoutes from "./routes/games.js";
import importExportRoutes from "./routes/importExport.js";
import genreRoutes from "./routes/genres.js";
import platformRoutes from "./routes/platforms.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/importExport", importExportRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/platforms", platformRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Serveur en écoute sur le port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));
