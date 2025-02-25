import express from "express";
import {
  addGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();

// Définition des routes
router.post("/", addGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);
router.put("/:id", updateGame);
router.delete("/:id", deleteGame);

export default router;
