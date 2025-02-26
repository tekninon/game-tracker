<template>
  <div class="stats-container">
    <h1>📊 Statistiques</h1>

    <!-- Affichage du temps total de jeu -->
    <p class="total-playtime">
      ⏳ Temps total de jeu : <strong>{{ totalPlaytime }} heures</strong>
    </p>

    <div class="chart-section">
      <!-- Graphique de répartition des genres -->
      <div class="chart-wrapper">
        <h2>🎮 Répartition des genres</h2>
        <canvas ref="genreCanvas"></canvas>
      </div>

      <!-- Graphique de répartition des plateformes -->
      <div class="chart-wrapper">
        <h2>🖥️ Répartition des plateformes</h2>
        <canvas ref="platformCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

Chart.register(...registerables)

export default {
  setup() {
    const genreCanvas = ref(null)
    const platformCanvas = ref(null)
    let genreChart = null
    let platformChart = null
    const totalPlaytime = ref(0)

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games/stats')
        console.log('📊 Données reçues :', response.data)

        const { totalPlaytime: playtime, genresDistribution, platformsDistribution } = response.data

        totalPlaytime.value = playtime // 🕒 Stocke le total des heures de jeu

        // 🎮 GESTION DU GRAPHIQUE DES GENRES
        const genres = genresDistribution.map((g) => g.genre)
        const genreValues = genresDistribution.map((g) => g.count)

        if (genreChart) genreChart.destroy()

        genreChart = new Chart(genreCanvas.value, {
          type: 'bar',
          data: {
            labels: genres,
            datasets: [
              {
                label: 'Répartition des genres',
                data: genreValues,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        })

        // 🖥️ GESTION DU GRAPHIQUE DES PLATEFORMES
        const platforms = platformsDistribution.map((p) => p.platform)
        const platformValues = platformsDistribution.map((p) => p.count)

        if (platformChart) platformChart.destroy()

        platformChart = new Chart(platformCanvas.value, {
          type: 'pie',
          data: {
            labels: platforms,
            datasets: [
              {
                label: 'Répartition des plateformes',
                data: platformValues,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(153, 102, 255, 0.5)',
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        })
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des stats :', error)
      }
    }

    onMounted(fetchStats)

    onUnmounted(() => {
      if (genreChart) genreChart.destroy()
      if (platformChart) platformChart.destroy()
    })

    return {
      genreCanvas,
      platformCanvas,
      totalPlaytime,
    }
  },
}
</script>

<style scoped>
.stats-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.total-playtime {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.chart-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
}

.chart-wrapper {
  width: 45%;
  height: 400px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
