<template>
  <div class="game-card">
    <img :src="game.image" alt="Game image" class="game-image" />
    <div class="game-info">
      <h2>{{ game.title }}</h2>
      <p><strong>🎮 Plateforme :</strong> {{ game.platform }}</p>
      <p><strong>📌 Statut :</strong> {{ game.status }}</p>
      <p><strong>⭐ Note :</strong> {{ game.rating }}/10</p>
      <div class="buttons">
        <button @click.stop="$router.push(`/edit-game/${game._id}`)">✏️ Modifier</button>
        <button @click.stop="showConfirmation">🗑️ Supprimer</button>
      </div>
    </div>

    <!-- Popup de confirmation -->
    <div v-if="showConfirmPopup" class="modal">
      <div class="modal-content">
        <h3>❗ Confirmation</h3>
        <p>Voulez-vous vraiment supprimer "{{ game.title }}" ?</p>
        <div class="modal-buttons">
          <button class="btn-cancel" @click.stop="showConfirmPopup = false">Annuler</button>
          <button class="btn-delete" @click.stop="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification' // Assure-toi que cet import est présent ✅

export default {
  props: {
    game: Object,
  },
  data() {
    return {
      showConfirmPopup: false,
      toast: useToast(),
    }
  },
  methods: {
    showConfirmation() {
      this.showConfirmPopup = true
    },
    confirmDelete() {
      this.$emit('delete', this.game._id)
      this.showConfirmPopup = false
    },
  },
}
</script>

<style scoped>
.game-card {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  background: white;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.game-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
}

.game-info {
  flex: 1;
}

.buttons {
  display: flex;
  gap: 10px;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
button:nth-child(2) {
  background: red;
}
button:nth-child(2):hover {
  background: darkred;
}

/* Styles de la popup */
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
  text-align: center;
  width: 300px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.btn-cancel {
  background: #ccc;
  color: black;
}

.btn-delete {
  background: red;
  color: white;
}

.btn-cancel,
.btn-delete {
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #aaa;
}

.btn-delete:hover {
  background: darkred;
}
</style>
