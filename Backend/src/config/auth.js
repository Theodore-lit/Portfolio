import jwt from 'jsonwebtoken';
import logger from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

export const generateToken = (payload, options = {}) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
      ...options,
    });
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw error;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Token decoding failed:', error);
    throw error;
  }
};
