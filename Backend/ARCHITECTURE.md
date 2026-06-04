# Structure Architecture MVC

## 📐 Pattern MVC avec Services

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (Frontend)                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                    HTTP/REST
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              ROUTES (Express Router)                    │
│  - Définissent les endpoints                            │
│  - Appliquent les middlewares                           │
│  - Routent vers les contrôleurs                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           CONTROLLERS (Orchestrateurs)                  │
│  - Récupèrent les données de la requête                 │
│  - Appèlent les services                                │
│  - Retournent les réponses HTTP                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           SERVICES (Logique métier)                     │
│  - Logique business découpée                            │
│  - Indépendante de Express/HTTP                         │
│  - Testable facilement                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            MODELS (Mongoose/ORM)                        │
│  - Schémas et validation des données                    │
│  - Requêtes à la base de données                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            DATABASE (MongoDB)                           │
│  - Persistance des données                              │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flux de requête exemple

**POST /api/projects**

```
1. EXPRESS ROUTE (projects.js)
   └─ Applique les validations et middlewares
   └─ Appelle projectController.createProject

2. CONTROLLER (projectController.js)
   └─ Récupère req.body et req.file
   └─ Appelle projectService.createProject(projectData)
   └─ Retourne la réponse au client

3. SERVICE (projectService.js)
   └─ Crée l'objet project avec les données
   └─ Appelle Project.create(projectData)
   └─ Log l'action
   └─ Retourne le projet créé

4. MODEL (Project.js)
   └─ Valide le schéma Mongoose
   └─ Exécute les middleware pré-save
   └─ Sauvegarde en MongoDB
   └─ Retourne le document créé

5. RESPONSE
   └─ Controller reçoit le projet
   └─ Retourne { success: true, data: project }
   └─ Client reçoit la réponse JSON
```

## 📦 Découplage des responsabilités

### ✅ Service (projectService.js)
```javascript
// Logique métier indépendante
async createProject(projectData) {
  const project = await Project.create(projectData);
  logger.info(`Project created: ${project._id}`);
  return project;
}
```

### ✅ Controller (projectController.js)
```javascript
// Gère la requête HTTP
export const createProject = catchAsync(async (req, res) => {
  const projectData = {
    ...req.body,
    image: req.file ? `projects/${req.file.filename}` : undefined,
  };
  const project = await projectService.createProject(projectData);
  res.status(201).json({ success: true, data: project });
});
```

### ✅ Route (projects.js)
```javascript
// Définit l'endpoint et les middleware
router.post(
  '/',
  authenticate,                              // Middleware d'auth
  authorize('admin'),                        // Middleware d'autorisation
  uploadMiddleware.single('projectImage'),   // Middleware de fichier
  handleUploadError,                         // Gestion erreurs upload
  validateCreateProject,                     // Validation express-validator
  validateRequest,                           // Gestion erreurs validation
  projectController.createProject            // Contrôleur
);
```

## 🎯 Avantages du Pattern MVC

| Aspect | Avantage |
|--------|----------|
| **Maintenabilité** | Code organisé et facile à naviguer |
| **Testabilité** | Services testables sans Express |
| **Réutilisabilité** | Services utilisables par plusieurs sources |
| **Scalabilité** | Facile d'ajouter de nouvelles features |
| **Séparation des responsabilités** | Chaque couche a un rôle défini |
| **Debugging** | Erreurs localisées dans la bonne couche |

## 🔗 Intégration des couches

```
Requête HTTP
    │
    ▼
┌─────────────────────────┐
│ MIDDLEWARES             │  - Validation (express-validator)
│                         │  - Authentification (JWT)
│                         │  - Upload fichiers (Multer)
│                         │  - Gestion erreurs
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ ROUTE                   │  - Définit le chemin
│ /api/projects           │  - Applique les middlewares
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ CONTROLLER              │  - Orchestration
│ createProject()         │  - Appèle le service
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ SERVICE                 │  - Logique métier
│ projectService          │  - Indépendant d'Express
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ MODEL                   │  - Schéma MongoDB
│ Project.create()        │  - Validation DB
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ DATABASE                │  - Persistance
│ MongoDB                 │
└─────────────────────────┘
```

## 💡 Exemple d'extension

### Ajouter une nouvelle entité (Category)

1. **Créer le modèle** (models/Category.js)
```javascript
const categorySchema = new mongoose.Schema({ ... });
export default mongoose.model('Category', categorySchema);
```

2. **Créer le service** (services/categoryService.js)
```javascript
class CategoryService {
  async createCategory(data) { ... }
  async getAll() { ... }
}
```

3. **Créer le contrôleur** (controllers/categoryController.js)
```javascript
export const createCategory = catchAsync(async (req, res) => { ... });
```

4. **Créer les routes** (routes/categories.js)
```javascript
router.post('/', authenticate, categoryController.createCategory);
```

5. **Ajouter à l'index** (routes/index.js)
```javascript
router.use('/categories', categoryRoutes);
```

**Résultat** : `/api/categories` entièrement fonctionnel ! ✅

