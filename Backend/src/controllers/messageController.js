import messageService from '../services/messageService.js';
import { catchAsync } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

// Créer un nouveau message (depuis le formulaire public)
export const createMessage = catchAsync(async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');

  const message = await messageService.createMessage(
    req.body,
    ipAddress,
    userAgent
  );

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message,
  });
});

// Récupérer tous les messages (Admin Dashboard)
export const getAllMessages = catchAsync(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    sort: req.query.sort || '-createdAt',
    status: req.query.status,
    isSpam: req.query.isSpam === 'true' ? true : undefined,
  };

  const result = await messageService.getAllMessages(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Récupérer un message par ID
export const getMessageById = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params.id);

  res.status(200).json({
    success: true,
    data: message,
  });
});

// Mettre à jour un message (statut, etc.)
export const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessage(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Message updated successfully',
    data: message,
  });
});

// Ajouter une réponse à un message
export const replyToMessage = catchAsync(async (req, res) => {
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({
      success: false,
      message: 'Reply message is required',
    });
  }

  const message = await messageService.replyToMessage(req.params.id, reply);

  res.status(200).json({
    success: true,
    message: 'Reply added successfully',
    data: message,
  });
});

// Supprimer un message
export const deleteMessage = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessage(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
    data: message,
  });
});

// Marquer comme spam
export const markAsSpam = catchAsync(async (req, res) => {
  const { isSpam = true } = req.body;

  const message = await messageService.markAsSpam(req.params.id, isSpam);

  res.status(200).json({
    success: true,
    message: `Message marked as ${isSpam ? 'spam' : 'not spam'}`,
    data: message,
  });
});

// Mettre à jour le statut d'un message
export const updateMessageStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  if (!['unread', 'read', 'archived', 'replied'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be: unread, read, archived, or replied',
    });
  }

  const message = await messageService.updateMessageStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: 'Message status updated successfully',
    data: message,
  });
});

// Archiver un message
export const archiveMessage = catchAsync(async (req, res) => {
  const message = await messageService.archiveMessage(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Message archived successfully',
    data: message,
  });
});

// Suppression en masse
export const deleteMultipleMessages = catchAsync(async (req, res) => {
  const { messageIds } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'messageIds array is required and must not be empty',
    });
  }

  const result = await messageService.deleteMultipleMessages(messageIds);

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} messages deleted successfully`,
    data: result,
  });
});

// Obtenir les statistiques des messages
export const getMessageStats = catchAsync(async (req, res) => {
  const stats = await messageService.getMessageStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Rechercher des messages
export const searchMessages = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const messages = await messageService.searchMessages(q);

  res.status(200).json({
    success: true,
    data: messages,
  });
});
