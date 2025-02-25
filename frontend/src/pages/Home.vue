<template>
  <div class="home-container">
    <h1>🎮 Mes Jeux Vidéo</h1>

    <div class="filters">
      <input v-model="search" type="text" placeholder="Rechercher un jeu..." />

      <select v-model="selectedPlatform">
        <option value="">Toutes les plateformes</option>
        <option v-for="platform in uniquePlatforms" :key="platform" :value="platform">
          {{ platform }}
        </option>
      </select>

      <select v-model="selectedStatus">
        <option value="">Tous les statuts</option>
        <option value="Terminé">Terminé</option>
        <option value="Non terminé">Non terminé</option>
        <option value="En cours">En cours</option>
      </select>
    </div>

    <p v-if="loading">Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="filteredGames.length" class="game-list">
      <GameCard
        v-for="game in filteredGames"
        :key="game._id"
        :game="game"
        @delete="deleteGame"
        @click="showGameDetails(game)"
      />
    </div>

    <p v-else>Aucun jeu ne correspond aux critères sélectionnés.</p>

    <div v-if="selectedGame" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedGame = null">&times;</span>
        <h2>{{ selectedGame.title }}</h2>
        <img :src="selectedGame.image" alt="Game image" class="modal-image" />
        <p><strong>Plateforme :</strong> {{ selectedGame.platform }}</p>
        <p><strong>Statut :</strong> {{ selectedGame.status }}</p>
        <p><strong>Note :</strong> {{ selectedGame.rating }}/10</p>
        <p><strong>Temps de jeu :</strong> {{ selectedGame.playtime }} heures</p>
        <p><strong>Difficulté :</strong> {{ selectedGame.difficulty }}</p>
        <p><strong>Rejouabilité :</strong> {{ selectedGame.replayability }}/5</p>
        <p><strong>Résumé :</strong> {{ selectedGame.summary }}</p>
        <p><strong>Commentaires :</strong> {{ selectedGame.comments }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/gameStore'
import GameCard from '@/components/GameCard.vue'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

export default {
  components: { GameCard },
  setup() {
    const gameStore = useGameStore()
    const { games, loading, error } = storeToRefs(gameStore)
    const { fetchGames, deleteGame } = gameStore

    const search = ref('')
    const selectedPlatform = ref('')
    const selectedStatus = ref('')
    const selectedGame = ref(null)

    onMounted(() => {
      fetchGames()
    })

    const uniquePlatforms = computed(() => {
      return [...new Set(games.value.map((game) => game.platform))]
    })

    const filteredGames = computed(() => {
      return games.value.filter(
        (game) =>
          (search.value === '' || game.title.toLowerCase().includes(search.value.toLowerCase())) &&
          (selectedPlatform.value === '' || game.platform === selectedPlatform.value) &&
          (selectedStatus.value === '' || game.status === selectedStatus.value),
      )
    })

    const showGameDetails = (game) => {
      selectedGame.value = game
    }

    return {
      games,
      loading,
      error,
      fetchGames,
      deleteGame,
      search,
      selectedPlatform,
      selectedStatus,
      uniquePlatforms,
      filteredGames,
      selectedGame,
      showGameDetails,
    }
  },
}
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters input,
.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.error {
  color: red;
}

/* Styles pour la modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  text-align: center;
}

.modal-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.close {
  right: 15px;
  top: 15px;
  font-size: 24px;
  cursor: pointer;
}
</style>
