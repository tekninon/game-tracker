import Game from "../models/Game.js";
import { Parser } from "json2csv";
import csvParser from "csv-parser";
import fs from "fs";
import multer from "multer";

// 📌 Configuration de multer pour gérer l'upload des fichiers
const upload = multer({ dest: "uploads/" });

// 🔹 Exporter les jeux en JSON ou CSV
export const exportGames = async (req, res) => {
  try {
    const format = req.query.format || "json";
    const games = await Game.find();

    if (format === "csv") {
      const fields = [
        "title",
        "platform",
        "genre",
        "status",
        "multiplayer",
        "rating",
        "playtime",
        "difficulty",
        "replayability",
        "summary",
        "comments",
        "image",
        "startDate",
        "createdAt",
      ];
      const json2csvParser = new Parser({ fields });
      const csvData = json2csvParser.parse(games);
      res.header("Content-Type", "text/csv");
      res.attachment("games.csv");
      return res.send(csvData);
    }

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Importer des jeux à partir d'un fichier JSON ou CSV
export const importGames = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Aucun fichier n'a été téléchargé" });
    }

    const { path, mimetype } = req.file;
    let games = [];

    if (mimetype === "application/json") {
      // 📌 Lecture du fichier JSON
      const data = fs.readFileSync(path, "utf-8");
      games = JSON.parse(data);
    } else if (mimetype === "text/csv") {
      // 📌 Lecture du fichier CSV
      const results = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          games = results;
          await saveGames(games, res);
        });
      return;
    } else {
      return res.status(400).json({ error: "Format de fichier non supporté" });
    }

    await saveGames(games, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Vérifie et insère les jeux sans doublon
const saveGames = async (games, res) => {
  try {
    let addedCount = 0;
    for (const game of games) {
      // 📌 Nettoyage et formatage des données
      game.multiplayer =
        game.multiplayer === "true" || game.multiplayer === true;
      game.rating = Number(game.rating) || 0;
      game.playtime = Number(game.playtime) || 0;
      game.replayability = Number(game.replayability) || 0;
      game.startDate = game.startDate ? new Date(game.startDate) : null;
      game.createdAt = game.createdAt ? new Date(game.createdAt) : new Date();
      game.genre =
        typeof game.genre === "string"
          ? game.genre.split(",").map((g) => g.trim())
          : game.genre;

      // 📌 Vérification des doublons avant insertion
      const existingGame = await Game.findOne({
        title: game.title,
        platform: game.platform,
      });
      if (!existingGame) {
        await Game.create(game);
        addedCount++;
      }
    }
    res.json({ message: "Importation réussie", new_games_added: addedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { upload };
