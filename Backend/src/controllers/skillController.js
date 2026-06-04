import skillService from '../services/skillService.js';
import { catchAsync } from '../middlewares/errorHandler.js';
import { deleteFile } from '../middlewares/uploadMiddleware.js';
import logger from '../config/logger.js';

// Créer une nouvelle skill
export const createSkill = catchAsync(async (req, res) => {
  const skillData = {
    ...req.body,
    icon: req.file ? `skills/${req.file.filename}` : undefined,
  };

  const skill = await skillService.createSkill(skillData);

  res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    data: skill,
  });
});

// Récupérer toutes les skills
export const getAllSkills = catchAsync(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 50,
    sort: req.query.sort || 'position',
    category: req.query.category,
    isHidden: req.query.isHidden === 'true' ? true : false,
  };

  // Si c'est une requête publique (pas d'auth), ne retourner que les skills visibles
  if (!req.user) {
    filters.isHidden = false;
  }

  const result = await skillService.getAllSkills(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Récupérer les skills groupées par catégorie
export const getSkillsByCategory = catchAsync(async (req, res) => {
  const skills = await skillService.getSkillsByCategory();

  res.status(200).json({
    success: true,
    data: skills,
  });
});

// Récupérer une skill par ID
export const getSkillById = catchAsync(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);

  res.status(200).json({
    success: true,
    data: skill,
  });
});

// Mettre à jour une skill
export const updateSkill = catchAsync(async (req, res) => {
  const updateData = { ...req.body };

  // Mettre à jour l'icône si un fichier est fourni
  if (req.file) {
    updateData.icon = `skills/${req.file.filename}`;
  }

  const skill = await skillService.updateSkill(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    data: skill,
  });
});

// Supprimer une skill
export const deleteSkill = catchAsync(async (req, res) => {
  const skill = await skillService.deleteSkill(req.params.id);

  // Supprimer l'icône si elle existe
  if (skill.icon) {
    deleteFile(skill.icon);
  }

  res.status(200).json({
    success: true,
    message: 'Skill deleted successfully',
    data: skill,
  });
});

// Mettre à jour l'icône d'une skill
export const updateSkillIcon = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No icon file provided',
    });
  }

  const skill = await skillService.updateSkillIcon(
    req.params.id,
    `skills/${req.file.filename}`
  );

  res.status(200).json({
    success: true,
    message: 'Skill icon updated successfully',
    data: skill,
  });
});

// Réordonner les skills
export const reorderSkills = catchAsync(async (req, res) => {
  const { skillsOrder } = req.body;

  const skills = await skillService.reorderSkills(skillsOrder);

  res.status(200).json({
    success: true,
    message: 'Skills reordered successfully',
    data: skills,
  });
});

// Lier des projets à une skill
export const linkSkillToProjects = catchAsync(async (req, res) => {
  const { projectIds } = req.body;

  const skill = await skillService.linkSkillToProjects(req.params.id, projectIds);

  res.status(200).json({
    success: true,
    message: 'Projects linked to skill',
    data: skill,
  });
});

// Retirer des projets d'une skill
export const unlinkSkillFromProjects = catchAsync(async (req, res) => {
  const { projectIds } = req.body;

  const skill = await skillService.unlinkSkillFromProjects(req.params.id, projectIds);

  res.status(200).json({
    success: true,
    message: 'Projects removed from skill',
    data: skill,
  });
});

// Masquer/Afficher une skill
export const toggleHideSkill = catchAsync(async (req, res) => {
  const { isHidden } = req.body;

  const skill = await skillService.toggleHideSkill(req.params.id, isHidden);

  res.status(200).json({
    success: true,
    message: `Skill ${isHidden ? 'hidden' : 'shown'} successfully`,
    data: skill,
  });
});

// Rechercher des skills
export const searchSkills = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const skills = await skillService.searchSkills(q);

  res.status(200).json({
    success: true,
    data: skills,
  });
});
