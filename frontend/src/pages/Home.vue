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

      <!-- Liste déroulante pour trier les jeux -->
      <div class="sort-container">
        <select v-model="sortBy">
          <option value="">Trier par</option>
          <option value="title">Nom {{ getSortIndicator('title') }}</option>
          <option value="rating">Note {{ getSortIndicator('rating') }}</option>
          <option value="difficulty">Difficulté {{ getSortIndicator('difficulty') }}</option>
          <option value="startDate">Date de début {{ getSortIndicator('startDate') }}</option>
        </select>
        <button @click="toggleSortOrder" class="sort-btn">
          {{ sortOrder === 'asc' ? '🔼' : '🔽' }}
        </button>
      </div>
    </div>

    <!-- 📌 Champ d'importation amélioré -->
    <div class="import-export">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".csv, .json"
        style="display: none"
      />
      <button @click="triggerFileInput">📂 Sélectionner un fichier</button>
      <span v-if="selectedFile">{{ selectedFile.name }}</span>
      <button @click="importGames">📥 Importer</button>
      <button @click="exportGames('csv')">📤 Exporter CSV</button>
      <button @click="exportGames('json')">📤 Exporter JSON</button>
      <button @click="downloadExampleFile">📄 Télécharger un exemple</button>
    </div>

    <p v-if="loading">Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="sortedGames.length" class="game-list">
      <GameCard
        v-for="game in sortedGames"
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
        <p><strong>📅 Date de début :</strong> {{ formatDate(selectedGame.startDate) }}</p>
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
import { format } from 'date-fns'
import axios from 'axios'
import { useToast } from 'vue-toastification'

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
    const sortBy = ref('')
    const sortOrder = ref('asc') // Ajout de cette ligne pour éviter l'erreur

    const selectedFile = ref(null)
    const fileInput = ref(null)

    const toast = useToast()

    onMounted(() => {
      fetchGames()
    })

    const formatDate = (date) => {
      if (!date) return 'Non spécifiée'
      return format(new Date(date), 'dd/MM/yyyy')
    }

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

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }

    const sortedGames = computed(() => {
      let sortedList = [...filteredGames.value]
      if (!sortBy.value) return sortedList

      const order = sortOrder.value === 'asc' ? 1 : -1

      return sortedList.sort((a, b) => {
        if (sortBy.value === 'title') {
          return order * a.title.localeCompare(b.title)
        }
        if (sortBy.value === 'rating') {
          return order * (b.rating - a.rating)
        }
        if (sortBy.value === 'difficulty') {
          const difficultyOrder = { Facile: 1, Moyen: 2, Difficile: 3 }
          return order * (difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        }
        if (sortBy.value === 'startDate') {
          return order * (new Date(a.startDate) - new Date(b.startDate))
        }
      })
    })

    const getSortIndicator = (field) => {
      if (sortBy.value !== field) return ''
      return sortOrder.value === 'asc' ? '↑' : '↓'
    }

    const showGameDetails = (game) => {
      selectedGame.value = game
    }

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      } else {
        console.error('❌ Erreur : fileInput.value est null')
      }
    }

    // 📌 Fonction pour gérer l'upload de fichier
    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        console.log('📂 Fichier sélectionné :', selectedFile.value)
      }
    }

    // 📌 Fonction pour importer les jeux
    const importGames = async () => {
      if (!selectedFile.value) {
        toast.error('Veuillez sélectionner un fichier CSV ou JSON.')
        return
      }

      const formData = new FormData()
      formData.append('file', selectedFile.value)

      try {
        console.log('📤 Envoi du fichier vers le backend...')
        const response = await axios.post(
          'http://localhost:5000/api/importExport/import',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )

        console.log('✅ Réponse du backend :', response.data)
        toast.success('Importation réussie !')
        fetchGames() // Recharge la liste des jeux après importation
      } catch (error) {
        console.error("❌ Erreur lors de l'importation :", error)
        toast.error("Erreur lors de l'importation.")
      }
    }

    // 📌 Fonction pour exporter les jeux
    const exportGames = async (format) => {
      try {
        console.log(`📤 Tentative d'export en ${format}`)

        const response = await axios.get(
          `http://localhost:5000/api/importExport/export?format=${format}`,
          { responseType: 'blob' },
        )

        console.log('✅ Réponse reçue :', response)

        const blob = new Blob([response.data], {
          type: format === 'csv' ? 'text/csv' : 'application/json',
        })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `games.${format}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success(`Exportation réussie en ${format.toUpperCase()} !`)
      } catch (error) {
        console.error("❌ Erreur lors de l'exportation :", error)
        toast.error("Erreur lors de l'exportation.")
      }
    }

    const downloadExampleFile = () => {
      const exampleData = [
        {
          title: 'Exemple Game 1',
          platform: 'PC',
          genre: 'RPG',
          status: 'Terminé',
          multiplayer: false,
          rating: 8,
          playtime: 42,
          difficulty: 'Moyen',
          replayability: 3,
          summary: 'Un jeu de rôle épique avec un monde ouvert.',
          comments: 'Très bon gameplay, histoire immersive.',
          image: 'https://example.com/image1.jpg',
          startDate: '2023-06-15T12:00:00.000Z',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Exemple Game 2',
          platform: 'PlayStation',
          genre: 'Action',
          status: 'En cours',
          multiplayer: true,
          rating: 7,
          playtime: 15,
          difficulty: 'Difficile',
          replayability: 4,
          summary: "Un jeu d'action intense avec des combats fluides.",
          comments: 'Les graphismes sont incroyables !',
          image: 'https://example.com/image2.jpg',
          startDate: '2024-01-10T15:30:00.000Z',
          createdAt: new Date().toISOString(),
        },
      ]

      const format = 'csv' // Change à "json" si tu veux un exemple JSON
      let content, type

      if (format === 'csv') {
        const headers = Object.keys(exampleData[0]).join(',')
        const rows = exampleData.map((game) =>
          Object.values(game)
            .map((value) => `"${value}"`)
            .join(','),
        )
        content = [headers, ...rows].join('\n')
        type = 'text/csv'
      } else {
        content = JSON.stringify(exampleData, null, 2)
        type = 'application/json'
      }

      const blob = new Blob([content], { type })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `example.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
      sortBy,
      sortOrder,
      uniquePlatforms,
      filteredGames,
      sortedGames,
      selectedGame,
      showGameDetails,
      formatDate,
      toggleSortOrder,
      getSortIndicator,
      handleFileUpload,
      importGames,
      exportGames,
      selectedFile, // ✅ Ajouté ici
      fileInput, // ✅ Ajouté ici
      triggerFileInput,
      downloadExampleFile,
    }
  },
}
</script>

<style scoped>
.import-export {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.import-export button {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
}

.import-export button:hover {
  background: #0056b3;
}

.import-export input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.home-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-btn {
  background: #ffc107;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.sort-btn:hover {
  background: #cb9b09;
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
  overflow: hidden; /* Empêche le défilement de toute la page */
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 50%;
  max-height: 80vh; /* Empêche le dépassement de l'écran */
  overflow-y: auto; /* Ajoute un défilement si trop d'infos */
  text-align: left; /* Texte aligné à gauche pour plus de lisibilité */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
}

.modal h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.modal p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: #555;
}

.modal p strong {
  color: #000; /* Met en valeur les titres */
  font-weight: 600;
}
/* Fixe la croix en haut à droite */
.close {
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  background: white;
  border-radius: 50%;
  padding: 5px;
  transition: 0.3s ease;
}

.close:hover {
  background: orange;
}
/* Ajout d'un léger espacement entre les blocs d'infos */
.modal-content p + p {
  margin-top: 8px;
}
.modal-image {
  display: block; /* Supprime les marges automatiques des images */
  max-width: 100%; /* Pour éviter qu'elle dépasse la largeur de la modale */
  height: auto; /* Garde le ratio original */
  margin: 20px auto; /* Centre horizontalement */
  border-radius: 10px;
}
</style>
