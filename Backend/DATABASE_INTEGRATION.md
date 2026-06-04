# Guide d'intégration de la base de données

Ce guide explique comment intégrer votre ORM/ODM préféré dans les services.

## Option 1 : MongoDB (Native Driver)

Déjà configuré avec **Mongoose**. Les services utilisent les modèles Mongoose directement.

```javascript
// Exemple dans projectService.js
const project = await Project.create(projectData);
const projects = await Project.find(query);
```

## Option 2 : MongoDB avec Mongoose (Recommandé)

**Installation :**
```bash
npm install mongoose
```

**Configuration dans config/database.js** (déjà fait ✅)

**Utilisation dans les modèles :**
```javascript
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // ...
});

export default mongoose.model('Project', projectSchema);
```

## Option 3 : MySQL/PostgreSQL avec Sequelize

**Installation :**
```bash
npm install sequelize mysql2  # Pour MySQL
npm install sequelize pg      # Pour PostgreSQL
```

**Créer config/database.js :**
```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',  // ou 'postgres'
  }
);

export default sequelize;
```

**Créer un modèle :**
```javascript
import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  // ...
});

export default Project;
```

**Utiliser dans le service :**
```javascript
async createProject(projectData) {
  const project = await Project.create(projectData);
  return project;
}
```

## Option 4 : PostgreSQL avec Prisma

**Installation :**
```bash
npm install @prisma/client
npx prisma init
```

**Configuration schema.prisma :**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id          Int     @id @default(autoincrement())
  title       String  @unique
  description String
  // ...
}
```

**Utiliser dans le service :**
```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async createProject(projectData) {
  const project = await prisma.project.create({
    data: projectData,
  });
  return project;
}
```

## Option 5 : TypeORM avec MySQL

**Installation :**
```bash
npm install typeorm reflect-metadata mysql2
```

**Configuration :**
```javascript
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/models/*.js'],
  synchronize: false,
});
```

## 🔄 Migration des services

Pour passer d'une ORM à une autre, modifiez uniquement :

1. **Les models** (models/*.js)
2. **La logique dans les services** (services/*.js)

Les **controllers et routes restent inchangés** ! C'est ça, la puissance du Pattern MVC.

### Exemple de migration Mongoose → Sequelize

**Avant (Mongoose) :**
```javascript
const project = await Project.findById(id);
```

**Après (Sequelize) :**
```javascript
const project = await Project.findByPk(id);
```

Seule la ligne change dans le service ! Les contrôleurs ne bougent pas.

## Variables d'environnement

Ajouter à `.env` selon votre choix :

**MongoDB :**
```env
MONGODB_URI=mongodb://localhost:27017/portfolio
```

**MySQL :**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio
DB_USER=root
DB_PASSWORD=password
```

**PostgreSQL :**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
```

## Initialisation de la base de données

### MongoDB
```javascript
// Mongoose se charge de la création automatique

// Ou exécuter directement :
mongo
> use portfolio
> db.projects.insertOne({ title: "Test" })
```

### MySQL
```bash
mysql -u root -p
> CREATE DATABASE portfolio;
> USE portfolio;
```

**Puis avec Sequelize :**
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### PostgreSQL
```bash
createdb portfolio
psql portfolio < schema.sql
```

## Tests de connexion

**Vérifier la connexion MongoDB :**
```javascript
// Dans config/database.js
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});
```

**Vérifier la connexion MySQL :**
```javascript
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connected'))
  .catch(err => console.error('❌ Connection error:', err));
```

---

**Besoin d'aide ?** Consultez la documentation officielle :
- Mongoose: https://mongoosejs.com/docs/
- Sequelize: https://sequelize.org/
- Prisma: https://www.prisma.io/docs/
- TypeORM: https://typeorm.io/
