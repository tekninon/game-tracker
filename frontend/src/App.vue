<template>
  <div>
    <nav class="navbar">
      <router-link to="/" active-class="active">🎮 Liste des Jeux</router-link>
      <router-link to="/add-game" active-class="active">➕ Ajouter un Jeu</router-link>
      <router-link to="/stats" active-class="active">📊 Statistiques</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  },
}
</script>

<style>
/* Supprime la marge par défaut du body */
body {
  margin: 0;
  padding: 0;
}

/* Barre de navigation */
.navbar {
  display: flex;
  justify-content: center;
  gap: 30px;
  background: #282c34;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

/* Style des liens */
.navbar a {
  text-decoration: none;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

/* Effet au survol */
.navbar a:hover {
  background: #0056b3;
  transform: scale(1.05);
}

/* Onglet actif */
.navbar .active {
  background: #ffc107;
  color: #333;
  transform: scale(1.1);
  box-shadow: 0px 0px 10px rgba(255, 193, 7, 0.7);
}
</style>
