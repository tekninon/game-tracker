import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import GameForm from '@/pages/AddGame.vue'
import EditGame from '@/pages/EditGame.vue'
import Stats from '@/pages/Stats.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/add-game', component: GameForm },
  { path: '/edit-game/:id', component: EditGame },
  { path: '/stats', component: Stats }, // 📊 Ajout de la route Statistiques
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
