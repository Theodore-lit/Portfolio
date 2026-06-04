# Essayez moi ! - Exemples d'utilisation rapide

## 🚀 Démarrage rapide

### 1. Installation
```bash
npm install
cp .env.example .env
```

### 2. Configuration .env
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=super_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

### 3. Démarrage du serveur
```bash
npm run dev
```

✅ Serveur lancé sur `http://localhost:5000`

---

## 📡 Exemples de requêtes cURL

### Health Check
```bash
curl http://localhost:5000/health
```

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2024-06-04T10:30:00.000Z",
  "environment": "development"
}
```

---

### Récupérer les projets

```bash
curl "http://localhost:5000/api/projects?page=1&limit=10"
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "projects": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

### Créer un projet (Admin)

**Avec Postman/Thunderclient :**

1. POST `http://localhost:5000/api/projects`
2. Headers: `Authorization: Bearer YOUR_TOKEN`
3. Body (form-data):
   - `title`: "Mon premier projet"
   - `description`: "Une description complète de mon projet"
   - `link`: "https://github.com/user/project"
   - `projectImage`: (sélectionner une image)

**Avec cURL :**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "title=Mon App React" \
  -F "description=Une super app avec React et Firebase" \
  -F "link=https://github.com/user/app" \
  -F "projectImage=@./image.png"
```

---

### Récupérer les skills groupées par catégorie

```bash
curl http://localhost:5000/api/skills/category
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "frontend": [],
    "backend": [],
    "database": [],
    "devops": [],
    "mobile": [],
    "other": []
  }
}
```

---

### Créer un message (Public - pas d'auth)

```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subject": "Intéressé par une collaboration",
    "message": "Bonjour, je suis intéressé par une collaboration..."
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "66602c4e5f1a2b3c4d5e6f7g",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subject": "Intéressé par une collaboration",
    "message": "Bonjour, je suis intéressé...",
    "status": "unread",
    "isSpam": false,
    "createdAt": "2024-06-04T10:30:00.000Z",
    "updatedAt": "2024-06-04T10:30:00.000Z"
  }
}
```

---

### Récupérer les messages (Admin)

```bash
curl http://localhost:5000/api/messages?page=1&limit=20 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Répondre à un message (Admin)

```bash
curl -X PUT http://localhost:5000/api/messages/{id}/reply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reply": "Merci pour votre message! Je vous recontacterai bientôt."
  }'
```

---

### Récupérer les statistiques des messages (Admin)

```bash
curl http://localhost:5000/api/messages/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "_id": null,
    "total": 5,
    "unread": 2,
    "read": 1,
    "replied": 1,
    "archived": 1,
    "spam": 0
  }
}
```

---

## 🐍 Avec Python

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Récupérer les projets
response = requests.get(f"{BASE_URL}/projects")
projects = response.json()['data']['projects']
print(f"Total de projets: {len(projects)}")

# Créer un message
message_data = {
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subject": "Collaboration",
    "message": "Je suis intéressé par une collaboration..."
}
response = requests.post(f"{BASE_URL}/messages", json=message_data)
print(response.json())
```

---

## 🟢 Avec Node.js

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Récupérer les projets
async function getProjects() {
  try {
    const { data } = await axios.get(`${BASE_URL}/projects`);
    console.log('Projets:', data.data.projects);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// Créer un message
async function createMessage() {
  try {
    const { data } = await axios.post(`${BASE_URL}/messages`, {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Collaboration',
      message: 'Je suis intéressé par une collaboration...'
    });
    console.log('Message créé:', data.data);
  } catch (error) {
    console.error('Erreur:', error.response?.data);
  }
}

getProjects();
createMessage();
```

---

## 🔐 Authentification

Actuellement, l'authentification est un placeholder. Pour l'implémenter :

1. **Créer une route de login :**
```javascript
// routes/auth.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Vérifier les credentials
  // Générer un JWT
  const token = generateToken({ id: user._id, role: 'admin' });
  res.json({ token, user });
});
```

2. **Utiliser le token :**
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:5000/api/projects
```

---

## 🛠 Dépannage

### Erreur "Cannot find module"
```bash
npm install
```

### Erreur "MongoDB connection failed"
- Vérifier que MongoDB est lancé
- Vérifier l'URI dans `.env`

### Port déjà utilisé
```bash
# Changer le port
PORT=5001 npm run dev
```

### Problème CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```

Solution : Modifier le CORS_ORIGIN dans `.env` avec l'URL du frontend

---

## 📱 Avec Thunder Client / Postman

### Import de collection

1. Créer une nouvelle collection
2. Ajouter les requêtes :

```
├── Projects
│   ├── GET /api/projects
│   ├── POST /api/projects
│   ├── GET /api/projects/:id
│   └── ...
├── Skills
│   ├── GET /api/skills
│   ├── GET /api/skills/category
│   └── ...
└── Messages
    ├── POST /api/messages
    ├── GET /api/messages
    └── ...
```

---

**Vous êtes prêt à développer votre backend ! 🚀**
