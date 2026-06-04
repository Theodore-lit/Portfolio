# Portfolio Backend API - Documentation

## 📋 Vue d'ensemble

Architecture MVC complète avec **Node.js**, **Express** et **MongoDB** pour gérer un dashboard admin de portfolio.

### Structure du projet

```
Backend/
├── src/
│   ├── config/              # Configuration globale
│   │   ├── logger.js        # Logger personnalisé
│   │   ├── database.js      # Connexion MongoDB
│   │   └── auth.js          # JWT configuration
│   │
│   ├── middlewares/         # Middlewares Express
│   │   ├── errorHandler.js  # Gestion centralisée des erreurs
│   │   ├── validation.js    # Validation express-validator
│   │   ├── uploadMiddleware.js # Configuration Multer
│   │   └── auth.js          # Authentication/Authorization
│   │
│   ├── models/              # Schémas Mongoose
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   └── Message.js
│   │
│   ├── services/            # Logique métier (découplée)
│   │   ├── projectService.js
│   │   ├── skillService.js
│   │   └── messageService.js
│   │
│   ├── controllers/         # Orchestrateurs des requêtes HTTP
│   │   ├── projectController.js
│   │   ├── skillController.js
│   │   └── messageController.js
│   │
│   ├── routes/              # Endpoints API
│   │   ├── index.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── messages.js
│   │
│   └── app.js               # Configuration Express
│
├── server.js                # Point d'entrée (clustering + env)
├── .env.example             # Variables d'environnement
├── uploads/                 # Dossier pour les fichiers
└── package.json
```

---

## 🚀 Installation et démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=votre_clé_secrète_ici
CORS_ORIGIN=http://localhost:3000
```

### 3. Démarrage du serveur

**Développement :**
```bash
npm run dev
```

**Production :**
```bash
npm run prod
```

**Démarrage simple :**
```bash
npm start
```

---

## 📡 Endpoints API

### ✅ Health Check
- `GET /health` - État du serveur

### 🎯 Projects (Projets)

#### Public
- `GET /api/projects` - Tous les projets publiés
  - Query params: `page=1&limit=10&sort=-createdAt&category=web`
- `GET /api/projects/:id` - Détail d'un projet
- `GET /api/projects/search?q=react` - Rechercher des projets

#### Admin (Protégé)
- `POST /api/projects` - Créer un projet
  - Body: `{ title, description, link, stackIds, position }`
  - File: `projectImage` (multipart)
  
- `PUT /api/projects/:id` - Mettre à jour
- `DELETE /api/projects/:id` - Supprimer
- `PUT /api/projects/:id/publish` - Publier/Dépublier
- `PUT /api/projects/:id/image` - Mettre à jour l'image
- `PUT /api/projects/:id/skills` - Ajouter des skills
- `DELETE /api/projects/:id/skills` - Retirer des skills

### 💻 Skills (Compétences/Stacks)

#### Public
- `GET /api/skills` - Toutes les skills visibles
  - Query: `page=1&limit=50&category=frontend`
- `GET /api/skills/category` - Skills groupées par catégorie
- `GET /api/skills/:id` - Détail d'une skill
- `GET /api/skills/search?q=react` - Rechercher

#### Admin (Protégé)
- `POST /api/skills` - Créer une skill
  - Body: `{ name, category, proficiency, yearsOfExperience }`
  - File: `skillIcon`
  
- `PUT /api/skills/:id` - Mettre à jour
- `DELETE /api/skills/:id` - Supprimer
- `PUT /api/skills/:id/icon` - Mettre à jour l'icône
- `PUT /api/skills/:id/hide` - Masquer/Afficher
- `PUT /api/skills/:id/projects` - Lier des projets

### 💬 Messages (Formulaire de contact)

#### Public
- `POST /api/messages` - Créer un message (formulaire)
  - Body: `{ name, email, subject, message }`

#### Admin (Protégé)
- `GET /api/messages` - Tous les messages
  - Query: `page=1&limit=20&status=unread&isSpam=false`
- `GET /api/messages/stats` - Statistiques
- `GET /api/messages/:id` - Détail (marque comme lu)
- `GET /api/messages/search?q=query` - Rechercher
- `PUT /api/messages/:id` - Mettre à jour
- `PUT /api/messages/:id/reply` - Ajouter une réponse
- `PUT /api/messages/:id/status` - Changer le statut
- `PUT /api/messages/:id/spam` - Marquer comme spam
- `DELETE /api/messages/:id` - Supprimer
- `DELETE /api/messages` - Suppression en masse

---

## 🔐 Authentification

### Obtenir un token JWT

**POST** `/auth/login` (à implémenter selon votre système d'auth)
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "role": "admin" }
}
```

### Utiliser le token

Ajouter à chaque requête protégée :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Exemples de requêtes

### Créer un projet

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Mon App React" \
  -F "description=Une application React moderne avec..." \
  -F "link=https://github.com/..." \
  -F "projectImage=@./project.png" \
  -F "stackIds[]=123,456"
```

### Récupérer les projets

```bash
curl http://localhost:5000/api/projects?page=1&limit=10
```

### Créer un message (public)

```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subject": "Collaboration",
    "message": "Je serais intéressé par une collaboration..."
  }'
```

### Répondre à un message (admin)

```bash
curl -X PUT http://localhost:5000/api/messages/123/reply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "reply": "Merci pour votre message..." }'
```

---

## 🎨 Réponses API

### Succès
```json
{
  "success": true,
  "message": "Action réussie",
  "data": { ... }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "details": "Informations supplémentaires (développement)"
}
```

---

## 🛠 Services disponibles

### ProjectService
- `createProject(projectData)` - Créer
- `getAllProjects(filters)` - Lister
- `getProjectById(projectId)` - Récupérer
- `updateProject(projectId, updateData)` - Mettre à jour
- `deleteProject(projectId)` - Supprimer
- `togglePublishProject(projectId, isPublished)` - Publier/Dépublier
- `reorderProjects(projectsOrder)` - Réordonner
- `searchProjects(query)` - Rechercher

### SkillService
- `createSkill(skillData)` - Créer
- `getAllSkills(filters)` - Lister
- `getSkillsByCategory()` - Grouper par catégorie
- `getSkillById(skillId)` - Récupérer
- `updateSkill(skillId, updateData)` - Mettre à jour
- `deleteSkill(skillId)` - Supprimer
- `toggleHideSkill(skillId, isHidden)` - Masquer/Afficher
- `reorderSkills(skillsOrder)` - Réordonner
- `searchSkills(query)` - Rechercher

### MessageService
- `createMessage(messageData, ipAddress, userAgent)` - Créer
- `getAllMessages(filters)` - Lister
- `getMessageById(messageId)` - Récupérer
- `updateMessage(messageId, updateData)` - Mettre à jour
- `replyToMessage(messageId, reply)` - Répondre
- `markAsSpam(messageId, isSpam)` - Marquer comme spam
- `getMessageStats()` - Statistiques
- `searchMessages(query)` - Rechercher

---

## 💾 Modèles de données

### Project
```javascript
{
  _id: ObjectId,
  title: String (unique),
  description: String,
  shortDescription: String,
  image: String,
  link: String (URL),
  repositoryLink: String,
  skillIds: [ObjectId],
  position: Number,
  isPublished: Boolean,
  views: Number,
  tags: [String],
  category: String (web|mobile|desktop|other),
  createdAt: Date,
  updatedAt: Date
}
```

### Skill
```javascript
{
  _id: ObjectId,
  name: String (unique),
  category: String (frontend|backend|database|devops|mobile|other),
  icon: String,
  iconUrl: String,
  proficiency: Number (1-5),
  position: Number,
  yearsOfExperience: Number,
  isHidden: Boolean,
  projects: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String (unread|read|archived|replied),
  reply: String,
  isSpam: Boolean,
  ipAddress: String,
  userAgent: String,
  readAt: Date,
  repliedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Sécurité

- ✅ **Helmet.js** - Headers de sécurité HTTP
- ✅ **CORS** - Contrôle d'accès cross-origin
- ✅ **Compression** - Gzip compression
- ✅ **JWT** - Authentification par tokens
- ✅ **express-validator** - Validation des données
- ✅ **Error Handling** - Gestion centralisée des erreurs
- ✅ **Rate Limiting** - À implémenter avec `express-rate-limit`

---

## 📋 À implémenter

- [ ] Authentification complète (login, register, OAuth Google)
- [ ] Rate limiting pour éviter les abus
- [ ] Pagination optimisée avec cursors
- [ ] Cache avec Redis
- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger/OpenAPI
- [ ] Logging avancé (Winston/Pino)
- [ ] Monitoring et alertes (Sentry)

---

## 📞 Support

Pour toute question ou problème, consultez la documentation Express :
- https://expressjs.com/
- https://mongoosejs.com/

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2024
