import mongoose from 'mongoose';
import logger from './logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

export const connectDatabase = async () => {
  try {
    // Options de connexion recommandées
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(MONGODB_URI, options);

    logger.info('MongoDB connected successfully');

    // Événements de connexion
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
    throw error;
  }
};

export default mongoose;
