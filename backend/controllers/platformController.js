import Platform from "../models/Platform.js";

// 🔹 Récupérer toutes les plateformes
export const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms.map((p) => p.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Ajouter une plateforme (non utilisé)
export const addPlatform = async (req, res) => {
  try {
    const { name } = req.body;
    const existingPlatform = await Platform.findOne({ name });
    if (existingPlatform)
      return res.status(400).json({ message: "Plateforme déjà existante" });

    const newPlatform = new Platform({ name });
    await newPlatform.save();
    res.status(201).json({
      message: "Plateforme ajoutée avec succès",
      platform: newPlatform,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
