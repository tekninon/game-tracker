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

// 🔹 Récupérer les statistiques de jeux
export const getGameStats = async (req, res) => {
  try {
    // 📌 1️⃣ Calcul du temps total de jeu
    const totalPlaytimeResult = await Game.aggregate([
      { $group: { _id: null, totalPlaytime: { $sum: "$playtime" } } },
    ]);
    const totalPlaytime = totalPlaytimeResult[0]?.totalPlaytime || 0;

    // 📌 2️⃣ Répartition des genres joués
    const genresResult = await Game.aggregate([
      { $unwind: "$genre" }, // Éclate les tableaux de genres pour les compter individuellement
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const genresDistribution = genresResult.map((g) => ({
      genre: g._id,
      count: g.count,
    }));

    // 📌 3️⃣ Répartition des plateformes les plus utilisées
    const platformsResult = await Game.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const platformsDistribution = platformsResult.map((p) => ({
      platform: p._id,
      count: p.count,
    }));

    res.json({ totalPlaytime, genresDistribution, platformsDistribution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
