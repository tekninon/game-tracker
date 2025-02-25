import Game from "../models/Game.js";

// 🔹 Ajouter un jeu
export const addGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res
      .status(201)
      .json({ message: "Jeu ajouté avec succès", id: newGame._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer tous les jeux
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer un jeu par son ID
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Jeu non trouvé" });
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Mettre à jour un jeu
export const updateGame = async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGame)
      return res.status(404).json({ message: "Jeu non trouvé" });
    res
      .status(200)
      .json({ message: "Jeu mis à jour avec succès", game: updatedGame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Supprimer un jeu
export const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame)
      return res.status(404).json({ message: "Jeu non trouvé" });
    res.status(200).json({ message: "Jeu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
