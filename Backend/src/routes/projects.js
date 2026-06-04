import express from 'express';
import * as projectController from '../controllers/projectController.js';
import {
  validateCreateProject,
  validateUpdateProject,
  validateProjectId,
  validatePagination,
} from '../middlewares/validation.js';
import { validateRequest } from '../middlewares/validation.js';
import { uploadMiddleware, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// ===========================
// Routes Publiques
// ===========================

// GET /api/projects - Récupérer tous les projets (publics)
router.get(
  '/',
  validatePagination,
  validateRequest,
  projectController.getAllProjects
);

// GET /api/projects/search?q=query - Rechercher des projets
router.get('/search', projectController.searchProjects);

// GET /api/projects/:id - Récupérer un projet par ID
router.get('/:id', validateProjectId, validateRequest, projectController.getProjectById);

// ===========================
// Routes Protégées (Admin)
// ===========================

// POST /api/projects - Créer un projet
router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('projectImage'),
  handleUploadError,
  validateCreateProject,
  validateRequest,
  projectController.createProject
);

// PUT /api/projects/:id - Mettre à jour un projet
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('projectImage'),
  handleUploadError,
  validateUpdateProject,
  validateRequest,
  projectController.updateProject
);

// DELETE /api/projects/:id - Supprimer un projet
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateProjectId,
  validateRequest,
  projectController.deleteProject
);

// PUT /api/projects/:id/publish - Publier/Dépublier un projet
router.put(
  '/:id/publish',
  authenticate,
  authorize('admin'),
  validateProjectId,
  validateRequest,
  projectController.togglePublishProject
);

// PUT /api/projects/:id/image - Mettre à jour l'image
router.put(
  '/:id/image',
  authenticate,
  authorize('admin'),
  uploadMiddleware.single('projectImage'),
  handleUploadError,
  validateProjectId,
  validateRequest,
  projectController.updateProjectImage
);

// PUT /api/projects/:id/skills - Ajouter des skills
router.put(
  '/:id/skills',
  authenticate,
  authorize('admin'),
  validateProjectId,
  validateRequest,
  projectController.addSkillsToProject
);

// DELETE /api/projects/:id/skills - Retirer des skills
router.delete(
  '/:id/skills',
  authenticate,
  authorize('admin'),
  validateProjectId,
  validateRequest,
  projectController.removeSkillsFromProject
);

// PUT /api/projects/reorder - Réordonner les projets
router.put(
  '/reorder',
  authenticate,
  authorize('admin'),
  projectController.reorderProjects
);

export default router;
