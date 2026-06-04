import express from 'express';
import * as messageController from '../controllers/messageController.js';
import {
  validateCreateMessage,
  validateMessageId,
  validatePagination,
} from '../middlewares/validation.js';
import { validateRequest } from '../middlewares/validation.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// ===========================
// Routes Publiques
// ===========================

// POST /api/messages - Créer un message (formulaire public)
router.post(
  '/',
  validateCreateMessage,
  validateRequest,
  messageController.createMessage
);

// ===========================
// Routes Protégées (Admin)
// ===========================

// GET /api/messages - Récupérer tous les messages (Admin Dashboard)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validatePagination,
  validateRequest,
  messageController.getAllMessages
);

// GET /api/messages/stats - Récupérer les statistiques
router.get(
  '/stats',
  authenticate,
  authorize('admin'),
  messageController.getMessageStats
);

// GET /api/messages/search?q=query - Rechercher des messages
router.get(
  '/search',
  authenticate,
  authorize('admin'),
  messageController.searchMessages
);

// GET /api/messages/:id - Récupérer un message par ID
router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.getMessageById
);

// PUT /api/messages/:id - Mettre à jour un message
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.updateMessage
);

// PUT /api/messages/:id/reply - Ajouter une réponse
router.put(
  '/:id/reply',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.replyToMessage
);

// PUT /api/messages/:id/status - Mettre à jour le statut
router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.updateMessageStatus
);

// PUT /api/messages/:id/archive - Archiver un message
router.put(
  '/:id/archive',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.archiveMessage
);

// PUT /api/messages/:id/spam - Marquer comme spam
router.put(
  '/:id/spam',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.markAsSpam
);

// DELETE /api/messages/:id - Supprimer un message
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateMessageId,
  validateRequest,
  messageController.deleteMessage
);

// DELETE /api/messages - Suppression en masse
router.delete(
  '/',
  authenticate,
  authorize('admin'),
  messageController.deleteMultipleMessages
);

export default router;
