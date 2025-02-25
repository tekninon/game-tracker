import Game from "../models/Game.js";
import { Parser } from "json2csv";
import csvParser from "csv-parser";
import fs from "fs";
import multer from "multer";

// Configuration de multer pour gérer l'upload des fichiers
const upload = multer({dest: "uploads/"});

// 🔹 Exporter les jeux en JSON ou CSV
export const exportGames = async(req, res) => {
    try {
        const format = req.query.format || "json";
        const games = await Game.find();

        if (format === "csv") {
            const fields = ["title", "platform", "genre", "status", "multiplayer", "rating", "playtime", "difficulty", "replayability", "summary", "comments", "image"];
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
}

// 🔹 Importer des jeux à partir d'un fichier JSON ou CSV
export const importGames = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier n'a été téléchargé" });
      }
  
      const { path, mimetype } = req.file;
      let games = [];
  
      if (mimetype === "application/json") {
        const data = fs.readFileSync(path, "utf-8");
        games = JSON.parse(data);
      } else if (mimetype === "text/csv") {
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
        const existingGame = await Game.findOne({ title: game.title, platform: game.platform });
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
  