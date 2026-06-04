# 🔐 Implémentation d'authentification (OPTIONNEL)

Ce fichier montre comment implémenter une authentification complète dans le projet.

## Étape 1 : Créer le modèle User

Créer `src/models/User.js` :

```javascript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // N'inclure le mot de passe que si demandé explicitement
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },

    name: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash le mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
```

---

## Étape 2 : Créer le service d'authentification

Créer `src/services/authService.js` :

```javascript
import User from '../models/User.js';
import { generateToken, verifyToken } from '../config/auth.js';
import { UnauthorizedError, ValidationError } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

class AuthService {
  async register(email, password, name) {
    try {
      // Vérifier que l'utilisateur n'existe pas déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError('Email already registered');
      }

      // Créer l'utilisateur
      const user = await User.create({
        email,
        password,
        name,
      });

      logger.info(`User registered: ${user._id}`);
      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Vérifier que les identifiants sont fournis
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Trouver l'utilisateur (include password)
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Vérifier que l'utilisateur est actif
      if (!user.isActive) {
        throw new UnauthorizedError('Account is disabled');
      }

      // Mettre à jour lastLogin
      user.lastLogin = new Date();
      await user.save();

      // Générer le token
      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      logger.info(`User logged in: ${user._id}`);

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userId, updateData) {
    try {
      // Ne pas permettre de modifier email/password ici
      const { email, password, ...allowedFields } = updateData;

      const user = await User.findByIdAndUpdate(
        userId,
        allowedFields,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      logger.info(`Profile updated: ${userId}`);
      return user;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Vérifier l'ancien mot de passe
      const isPasswordValid = await user.matchPassword(oldPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Current password is incorrect');
      }

      // Mettre à jour le mot de passe
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed: ${userId}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }
}

export default new AuthService();
```

---

## Étape 3 : Créer le contrôleur d'authentification

Créer `src/controllers/authController.js` :

```javascript
import authService from '../services/authService.js';
import { catchAsync } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

export const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  const user = await authService.register(email, password, name);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const result = await authService.changePassword(req.user.id, oldPassword, newPassword);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
```

---

## Étape 4 : Créer les routes d'authentification

Créer `src/routes/auth.js` :

```javascript
import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateAuth = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Validation des données
const validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes publiques
router.post('/register', validateRegister, validateAuth, authController.register);
router.post('/login', validateLogin, validateAuth, authController.login);

// Routes protégées
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);

export default router;
```

---

## Étape 5 : Ajouter les routes d'authentification

Modifier `src/routes/index.js` :

```javascript
import express from 'express';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import skillRoutes from './skills.js';
import messageRoutes from './messages.js';

const router = express.Router();

// Auth routes (doit être avant les autres routes protégées)
router.use('/auth', authRoutes);

// Autres routes
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/messages', messageRoutes);

// ...
```

---

## Étape 6 : Ajouter les validations d'authentification

Ajouter à `src/middlewares/validation.js` :

```javascript
export const validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateChangePassword = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];
```

---

## Utilisation

### 1. Créer un compte
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

### 3. Utiliser le token pour les requêtes protégées
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projects
```

### 4. Récupérer le profil
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/profile
```

---

## Sécurité

- ✅ Les mots de passe sont hashés avec bcryptjs
- ✅ Les tokens JWT expirent après 7 jours
- ✅ Les mots de passe ne sont pas retournés dans les réponses
- ✅ Validation des emails et des mots de passe
- ✅ Vérification des comptes actifs

---

## À améliorer

- [ ] Refresh tokens pour prolonger la session
- [ ] Email verification pour les nouveaux utilisateurs
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Rate limiting sur les routes d'auth

---

**Intégrez cette authentification et votre backend sera complet ! 🔐**
