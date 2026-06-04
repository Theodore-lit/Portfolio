import Message from '../models/Message.js';
import { NotFoundError } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

class MessageService {
  // Créer un nouveau message (depuis le formulaire de contact public)
  async createMessage(messageData, ipAddress, userAgent) {
    try {
      const message = await Message.create({
        ...messageData,
        ipAddress,
        userAgent,
      });

      logger.info(`Message received from ${messageData.email}`);
      return message;
    } catch (error) {
      logger.error('Error creating message:', error);
      throw error;
    }
  }

  // Récupérer tous les messages (pour le dashboard admin)
  async getAllMessages(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = '-createdAt',
        status,
        isSpam,
      } = filters;

      const query = {};

      if (status) {
        query.status = status;
      }

      if (isSpam !== undefined) {
        query.isSpam = isSpam;
      }

      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        Message.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Message.countDocuments(query),
      ]);

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Récupérer un message par ID
  async getMessageById(messageId) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $set: { status: 'read' } },
        { new: true }
      );

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      return message;
    } catch (error) {
      logger.error(`Error fetching message ${messageId}:`, error);
      throw error;
    }
  }

  // Mettre à jour un message (ajouter une réponse, changer le statut, etc.)
  async updateMessage(messageId, updateData) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      logger.info(`Message updated: ${messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error updating message ${messageId}:`, error);
      throw error;
    }
  }

  // Ajouter une réponse à un message
  async replyToMessage(messageId, reply) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            reply,
            status: 'replied',
            repliedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      logger.info(`Reply added to message: ${messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error replying to message ${messageId}:`, error);
      throw error;
    }
  }

  // Supprimer un message
  async deleteMessage(messageId) {
    try {
      const message = await Message.findByIdAndDelete(messageId);

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      logger.info(`Message deleted: ${messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  }

  // Marquer comme spam
  async markAsSpam(messageId, isSpam = true) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { isSpam },
        { new: true }
      );

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      logger.info(`Message marked as ${isSpam ? 'spam' : 'not spam'}: ${messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error marking message as spam ${messageId}:`, error);
      throw error;
    }
  }

  // Changer le statut d'un message
  async updateMessageStatus(messageId, status) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            status,
            readAt: status === 'read' ? new Date() : undefined,
          },
        },
        { new: true }
      );

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      logger.info(`Message status updated to '${status}': ${messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error updating message status ${messageId}:`, error);
      throw error;
    }
  }

  // Archiver un message
  async archiveMessage(messageId) {
    try {
      return this.updateMessageStatus(messageId, 'archived');
    } catch (error) {
      logger.error(`Error archiving message ${messageId}:`, error);
      throw error;
    }
  }

  // Suppression en masse de messages
  async deleteMultipleMessages(messageIds) {
    try {
      const result = await Message.deleteMany({ _id: { $in: messageIds } });
      logger.info(`${result.deletedCount} messages deleted`);
      return result;
    } catch (error) {
      logger.error('Error deleting multiple messages:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des messages
  async getMessageStats() {
    try {
      const stats = await Message.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: {
              $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] },
            },
            read: {
              $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] },
            },
            replied: {
              $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] },
            },
            archived: {
              $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] },
            },
            spam: {
              $sum: { $cond: [{ $eq: ['$isSpam', true] }, 1, 0] },
            },
          },
        },
      ]);

      return stats[0] || {
        total: 0,
        unread: 0,
        read: 0,
        replied: 0,
        archived: 0,
        spam: 0,
      };
    } catch (error) {
      logger.error('Error fetching message stats:', error);
      throw error;
    }
  }

  // Rechercher des messages
  async searchMessages(query) {
    try {
      const messages = await Message.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { subject: { $regex: query, $options: 'i' } },
          { message: { $regex: query, $options: 'i' } },
        ],
      })
        .sort('-createdAt')
        .limit(50);

      return messages;
    } catch (error) {
      logger.error('Error searching messages:', error);
      throw error;
    }
  }
}

export default new MessageService();
