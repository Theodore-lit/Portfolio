import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ValidationError } from './errorHandler.js';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin des uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Créer des sous-dossiers selon le type
    let subDir = 'other';
    if (file.fieldname === 'projectImage') {
      subDir = 'projects';
    } else if (file.fieldname === 'skillIcon') {
      subDir = 'skills';
    }

    const dir = path.join(uploadDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // Générer un nom unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtre les fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
      ),
      false
    );
  }
};

// Configuration de multer
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB par défaut
  },
});

// Middleware pour gérer les erreurs de multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';

    if (error.code === 'LIMIT_FILE_SIZE') {
      message = `File too large. Max size: ${(process.env.MAX_FILE_SIZE || 5242880) / 1024 / 1024}MB`;
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }

    logger.warn(`Upload error: ${message}`);
    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

// Utilitaire pour supprimer un fichier
export const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(uploadDir, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`File deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error deleting file: ${filePath}`, error);
    return false;
  }
};

// Utilitaire pour obtenir l'URL du fichier
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `/uploads/${filePath}`;
};
