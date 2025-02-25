<template>
  <div class="form-container">
    <h2>Ajouter un Jeu</h2>
    <form @submit.prevent="submitGame">
      <div class="form-grid">
        <div class="form-group">
          <label for="title">🎮 Titre :</label>
          <input v-model="game.title" type="text" id="title" required />
        </div>

        <div class="form-group">
          <label for="platform">🖥️ Plateforme :</label>
          <input v-model="game.platform" type="text" id="platform" list="platforms" required />
          <datalist id="platforms">
            <option v-for="platform in platformList" :key="platform" :value="platform" />
          </datalist>
        </div>

        <div class="form-group">
          <label for="genre">🎭 Genre :</label>
          <input v-model="game.genre" type="text" id="genre" list="genres" required />
          <datalist id="genres">
            <option v-for="genre in genreList" :key="genre" :value="genre" />
          </datalist>
        </div>

        <div class="form-group">
          <label for="status">📌 Statut :</label>
          <select v-model="game.status" id="status">
            <option value="Terminé">Terminé</option>
            <option value="Non terminé">Non terminé</option>
            <option value="En cours">En cours</option>
          </select>
        </div>

        <div class="form-group checkbox">
          <label for="multiplayer">🎮 Multijoueur :</label>
          <input type="checkbox" v-model="game.multiplayer" id="multiplayer" />
        </div>

        <div class="form-group">
          <label for="rating">⭐ Note (0-10) :</label>
          <input v-model.number="game.rating" type="number" id="rating" min="0" max="10" />
        </div>

        <div class="form-group">
          <label for="playtime">⏳ Temps de jeu (heures) :</label>
          <input v-model.number="game.playtime" type="number" id="playtime" min="0" />
        </div>

        <div class="form-group">
          <label for="difficulty">🎯 Difficulté :</label>
          <select v-model="game.difficulty" id="difficulty">
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>

        <div class="form-group">
          <label for="replayability">🔄 Rejouabilité (0-5) :</label>
          <input
            v-model.number="game.replayability"
            type="number"
            id="replayability"
            min="0"
            max="5"
          />
        </div>

        <div class="form-group full-width">
          <label for="summary">📜 Résumé :</label>
          <textarea v-model="game.summary" id="summary"></textarea>
        </div>

        <div class="form-group full-width">
          <label for="comments">💬 Commentaires :</label>
          <textarea v-model="game.comments" id="comments"></textarea>
        </div>

        <div class="form-group full-width">
          <label for="image">🖼️ URL de l'image :</label>
          <input v-model="game.image" type="text" id="image" placeholder="URL de l'image" />
        </div>
      </div>

      <button type="submit" class="btn-submit">✅ Ajouter</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import axios from 'axios'

export default {
  setup() {
    const gameStore = useGameStore()
    const game = ref({
      title: '',
      platform: '',
      genre: '',
      status: 'Non terminé',
      multiplayer: false,
      rating: 5,
      playtime: 0,
      difficulty: 'Moyen',
      replayability: 0,
      summary: '',
      comments: '',
      image: '',
    })

    const genreList = ref([])
    const platformList = ref([])

    const fetchGenresAndPlatforms = async () => {
      try {
        const genresResponse = await axios.get('http://localhost:5000/api/genres')
        genreList.value = genresResponse.data

        const platformsResponse = await axios.get('http://localhost:5000/api/platforms')
        platformList.value = platformsResponse.data
      } catch (error) {
        console.error('Erreur lors de la récupération des genres et plateformes :', error)
      }
    }

    onMounted(fetchGenresAndPlatforms)

    const submitGame = async () => {
      game.value.genre = game.value.genre.split(',').map((g) => g.trim())
      await gameStore.addGame(game.value)
      game.value = {
        title: '',
        platform: '',
        genre: '',
        status: 'Non terminé',
        multiplayer: false,
        rating: 5,
        playtime: 0,
        difficulty: 'Moyen',
        replayability: 0,
        summary: '',
        comments: '',
        image: '',
      }
    }

    return { game, submitGame, genreList, platformList }
  },
}
</script>

<style scoped>
.form-container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f8f8f8;
}

textarea {
  min-height: 80px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

.checkbox {
  flex-direction: row;
  align-items: center;
}

.checkbox input {
  width: auto;
  margin-left: 10px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: #007bff;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-submit:hover {
  background: #0056b3;
}
</style>
