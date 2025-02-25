import Genre from "../models/Genre.js";

// 🔹 Récupérer tous les genres
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres.map((g) => g.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Ajouter un genre (non utilisé)
export const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre)
      return res.status(400).json({ message: "Genre déjà existant" });

    const newGenre = new Genre({ name });
    await newGenre.save();
    res
      .status(201)
      .json({ message: "Genre ajouté avec succès", genre: newGenre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
