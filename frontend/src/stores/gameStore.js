import { defineStore } from "pinia";
import axios from "axios";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    games: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchGames() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:5000/api/games");
        this.games = response.data;
      } catch (err) {
        this.error = "Erreur lors de la récupération des jeux.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addGame(gameData) {
      try {
        const response = await axios.post("http://localhost:5000/api/games", gameData);
        this.games.push(response.data);
      } catch (err) {
        this.error = "Erreur lors de l'ajout du jeu.";
        console.error(err);
      }
    },

    async deleteGame(gameId) {
      try {
        await axios.delete(`http://localhost:5000/api/games/${gameId}`);
        this.games = this.games.filter(game => game._id !== gameId);
      } catch (err) {
        this.error = "Erreur lors de la suppression du jeu.";
        console.error(err);
      }
    }
  }
});
