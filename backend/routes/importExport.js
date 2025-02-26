import express from "express";
import {
  exportGames,
  importGames,
  upload,
} from "../controllers/importExportController.js";

const router = express.Router();

// 🔹 Exporter les jeux en JSON ou CSV
router.get("/export", exportGames);

// 🔹 Importer des jeux à partir d'un fichier JSON ou CSV
router.post("/import", upload.single("file"), importGames);

export default router;
