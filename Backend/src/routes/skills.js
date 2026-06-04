import express from 'express';
import * as skillController from '../controllers/skillController.js';
import {
  validateCreateSkill,
  validateUpdateSkill,
  validateSkillId,
  validatePagination,
} from '../middlewares/validation.js';
import { validateRequest } from '../middlewares/validation.js';
import { uploadMiddleware, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// ===========================
// Routes Publiques
// ===========================

// GET /api/skills - Récupérer toutes les skills
router.get(
  '/',
  validatePagination,
  validateRequest,
  skillController.getAllSkills
);

// GET /api/skills/category - Récupérer les skills groupées par catégorie
router.get('/category', skillController.getSkillsByCategory);

// GET /api/skills/search?q=query - Rechercher des skills
router.get('/search', skillController.searchSkills);

// GET /api/skills/:id - Récupérer une skill par ID
router.get('/:id', validateSkillId, validateRequest, skillController.getSkillById);

// ===========================
// Routes Protégées (Admin)
// ===========================

// POST /api/skills - Créer une skill
router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('skillIcon'),
  handleUploadError,
  validateCreateSkill,
  validateRequest,
  skillController.createSkill
);

// PUT /api/skills/:id - Mettre à jour une skill
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('skillIcon'),
  handleUploadError,
  validateUpdateSkill,
  validateRequest,
  skillController.updateSkill
);

// DELETE /api/skills/:id - Supprimer une skill
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateSkillId,
  validateRequest,
  skillController.deleteSkill
);

// PUT /api/skills/:id/icon - Mettre à jour l'icône
router.put(
  '/:id/icon',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('skillIcon'),
  handleUploadError,
  validateSkillId,
  validateRequest,
  skillController.updateSkillIcon
);

// PUT /api/skills/reorder - Réordonner les skills
router.put(
  '/reorder',
  authenticate,
  authorize('admin'),
  skillController.reorderSkills
);

// PUT /api/skills/:id/hide - Masquer/Afficher
router.put(
  '/:id/hide',
  authenticate,
  authorize('admin'),
  validateSkillId,
  validateRequest,
  skillController.toggleHideSkill
);

// PUT /api/skills/:id/projects - Lier des projets
router.put(
  '/:id/projects',
  authenticate,
  authorize('admin'),
  validateSkillId,
  validateRequest,
  skillController.linkSkillToProjects
);

// DELETE /api/skills/:id/projects - Retirer des projets
router.delete(
  '/:id/projects',
  authenticate,
  authorize('admin'),
  validateSkillId,
  validateRequest,
  skillController.unlinkSkillFromProjects
);

export default router;
