<template>
  <GameForm :isEdit="false" @submit="addGame" />
</template>

<script>
import GameForm from '@/components/GameForm.vue'
import { useGameStore } from '@/stores/gameStore'
import { useToast } from 'vue-toastification' // Assure-toi que cet import est présent ✅

export default {
  components: { GameForm },
  setup() {
    const gameStore = useGameStore()
    const toast = useToast() // Initialisation du toast

    const addGame = async (game) => {
      await gameStore.addGame(game)
      toast.success('🎉 Jeu ajouté avec succès !') // Affichage du toast
    }

    return { addGame }
  },
}
</script>
