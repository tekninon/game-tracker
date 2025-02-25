<template>
  <GameForm :game="game" :isEdit="true" @submit="updateGame" />
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import GameForm from '@/components/GameForm.vue'
import { useToast } from 'vue-toastification' // Assure-toi que cet import est présent ✅

export default {
  components: { GameForm },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast() // Initialisation du toast
    const game = ref(null)

    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/games/${route.params.id}`)
        game.value = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération du jeu :', error)
      }
    }

    const updateGame = async (updatedGame) => {
      await axios.put(`http://localhost:5000/api/games/${route.params.id}`, updatedGame)
      toast.success('✅ Jeu modifié avec succès !')
      router.push('/')
    }

    onMounted(fetchGameDetails)

    return { game, updateGame }
  },
}
</script>
