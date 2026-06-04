import projectService from '../services/projectService.js';
import { catchAsync } from '../middlewares/errorHandler.js';
import { deleteFile } from '../middlewares/uploadMiddleware.js';
import logger from '../config/logger.js';

// Créer un nouveau projet
export const createProject = catchAsync(async (req, res) => {
  const projectData = {
    ...req.body,
    image: req.file ? `projects/${req.file.filename}` : undefined,
  };

  const project = await projectService.createProject(projectData);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project,
  });
});

// Récupérer tous les projets
export const getAllProjects = catchAsync(async (req, res) => {
  const filters = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: req.query.sort || '-createdAt',
    isPublished: req.query.isPublished === 'true' ? true : undefined,
    category: req.query.category,
  };

  // Filtrer les projets non publiés si c'est une requête publique (pas d'auth)
  if (!req.user) {
    filters.isPublished = true;
  }

  const result = await projectService.getAllProjects(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Récupérer un projet par ID
export const getProjectById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);

  res.status(200).json({
    success: true,
    data: project,
  });
});

// Mettre à jour un projet
export const updateProject = catchAsync(async (req, res) => {
  const updateData = { ...req.body };

  // Mettre à jour l'image si un fichier est fourni
  if (req.file) {
    updateData.image = `projects/${req.file.filename}`;
  }

  const project = await projectService.updateProject(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project,
  });
});

// Supprimer un projet
export const deleteProject = catchAsync(async (req, res) => {
  const project = await projectService.deleteProject(req.params.id);

  // Supprimer l'image si elle existe
  if (project.image) {
    deleteFile(project.image);
  }

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: project,
  });
});

// Ajouter des skills à un projet
export const addSkillsToProject = catchAsync(async (req, res) => {
  const { skillIds } = req.body;

  const project = await projectService.addSkillsToProject(req.params.id, skillIds);

  res.status(200).json({
    success: true,
    message: 'Skills added to project',
    data: project,
  });
});

// Retirer des skills d'un projet
export const removeSkillsFromProject = catchAsync(async (req, res) => {
  const { skillIds } = req.body;

  const project = await projectService.removeSkillsFromProject(req.params.id, skillIds);

  res.status(200).json({
    success: true,
    message: 'Skills removed from project',
    data: project,
  });
});

// Mettre à jour l'image d'un projet
export const updateProjectImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided',
    });
  }

  const project = await projectService.updateProjectImage(
    req.params.id,
    `projects/${req.file.filename}`
  );

  res.status(200).json({
    success: true,
    message: 'Project image updated successfully',
    data: project,
  });
});

// Publier/Dépublier un projet
export const togglePublishProject = catchAsync(async (req, res) => {
  const { isPublished } = req.body;

  const project = await projectService.togglePublishProject(req.params.id, isPublished);

  res.status(200).json({
    success: true,
    message: `Project ${isPublished ? 'published' : 'unpublished'} successfully`,
    data: project,
  });
});

// Réordonner les projets
export const reorderProjects = catchAsync(async (req, res) => {
  const { projectsOrder } = req.body;

  const projects = await projectService.reorderProjects(projectsOrder);

  res.status(200).json({
    success: true,
    message: 'Projects reordered successfully',
    data: projects,
  });
});

// Rechercher des projets
export const searchProjects = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const projects = await projectService.searchProjects(q);

  res.status(200).json({
    success: true,
    data: projects,
  });
});
