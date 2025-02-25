# 📜 Contrat d'Interface API REST - Game Tracker

## 🎮 Endpoints des jeux vidéo

### 📌 Créer un jeu
**POST `/games`**  
- **Body (JSON)** :
  ```json
  {
    "title": "The Witcher 3",
    "platform": "PC",
    "genre": ["RPG", "Action"],
    "status": "Terminé",
    "multiplayer": false,
    "rating": 9.5,
    "playtime": 120,
    "difficulty": "Difficile",
    "replayability": 4,
    "summary": "Un excellent RPG avec une histoire immersive.",
    "comments": "L'un des meilleurs jeux auxquels j'ai joué.",
    "image": "url_de_l_image"
  }
  ```
- **Réponse (JSON)** : `201 Created`
  ```json
  { "message": "Jeu ajouté avec succès", "id": "xxxx" }
  ```

---

### 📌 Récupérer tous les jeux
**GET `/games`**  
- **Réponse (JSON)** :
  ```json
  [
    {
      "id": "xxxx",
      "title": "The Witcher 3",
      "platform": "PC",
      "status": "Terminé",
      "rating": 9.5
    }
  ]
  ```

---

### 📌 Récupérer un jeu par son ID
**GET `/games/:id`**  
- **Réponse (JSON)** :
  ```json
  {
    "id": "xxxx",
    "title": "The Witcher 3",
    "platform": "PC",
    "status": "Terminé",
    "rating": 9.5
  }
  ```

---

### 📌 Modifier un jeu
**PUT `/games/:id`**  
- **Body (JSON)** (Seuls les champs à modifier) :
  ```json
  { "status": "Non terminé", "rating": 8 }
  ```
- **Réponse (JSON)** :
  ```json
  { "message": "Jeu mis à jour avec succès" }
  ```

---

### 📌 Supprimer un jeu
**DELETE `/games/:id`**  
- **Réponse (JSON)** :
  ```json
  { "message": "Jeu supprimé avec succès" }
  ```

---

## 📂 Import / Export des données  

### 📌 Exporter les jeux
**GET `/export?format=json|csv`**  
- **Réponse (Fichier JSON/CSV)** contenant tous les jeux.

---

### 📌 Importer des jeux
**POST `/import`**  
- **Body (Fichier JSON/CSV)** :
  - Le serveur vérifie l’absence de doublons (titre + plateforme).
  - Ajoute les nouveaux jeux.
- **Réponse (JSON)** :
  ```json
  { "message": "Importation réussie", "new_games_added": 10 }
  ```

