import { body, param, validationResult, query } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Middleware pour gérer les erreurs de validation express-validator
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    return next(new ValidationError(`Validation failed: ${messages.map((m) => m.message).join(', ')}`));
  }
  next();
};

// ===========================
// Validations pour PROJETS
// ===========================
export const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('link')
    .trim()
    .optional()
    .isURL()
    .withMessage('Link must be a valid URL'),

  body('stackIds')
    .optional()
    .isArray()
    .withMessage('Stack IDs must be an array'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),
];

export const validateUpdateProject = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('link')
    .optional()
    .isURL()
    .withMessage('Link must be a valid URL'),

  body('stackIds')
    .optional()
    .isArray()
    .withMessage('Stack IDs must be an array'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),

  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

export const validateProjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

// ===========================
// Validations pour SKILLS/STACKS
// ===========================
export const validateCreateSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['frontend', 'backend', 'database', 'devops', 'mobile', 'other'])
    .withMessage('Invalid category'),

  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Proficiency must be between 1 and 5'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),
];

export const validateUpdateSkill = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('category')
    .optional()
    .isIn(['frontend', 'backend', 'database', 'devops', 'mobile', 'other'])
    .withMessage('Invalid category'),

  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Proficiency must be between 1 and 5'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),

  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID'),
];

export const validateSkillId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID'),
];

// ===========================
// Validations pour MESSAGES
// ===========================
export const validateCreateMessage = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
];

export const validateMessageId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid message ID'),
];

// ===========================
// Validations pour PAGINATION
// ===========================
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort must be either asc or desc'),
];
