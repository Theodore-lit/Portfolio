import Project from '../models/Project.js';
import { NotFoundError } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

class ProjectService {
  // Créer un nouveau projet
  async createProject(projectData) {
    try {
      const project = await Project.create(projectData);
      logger.info(`Project created: ${project._id}`);
      return project;
    } catch (error) {
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  // Récupérer tous les projets
  async getAllProjects(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        isPublished,
        category,
      } = filters;

      const query = {};

      // Filtres optionnels
      if (isPublished !== undefined) {
        query.isPublished = isPublished;
      }
      if (category) {
        query.category = category;
      }

      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        Project.find(query)
          .populate('skillIds', 'name icon')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Project.countDocuments(query),
      ]);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Récupérer un projet par ID
  async getProjectById(projectId) {
    try {
      const project = await Project.findById(projectId).populate(
        'skillIds',
        'name category icon proficiency'
      );

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Incrémenter le compteur de vues
      project.views += 1;
      await project.save();

      return project;
    } catch (error) {
      logger.error(`Error fetching project ${projectId}:`, error);
      throw error;
    }
  }

  // Mettre à jour un projet
  async updateProject(projectId, updateData) {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      ).populate('skillIds', 'name icon');

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(`Project updated: ${projectId}`);
      return project;
    } catch (error) {
      logger.error(`Error updating project ${projectId}:`, error);
      throw error;
    }
  }

  // Supprimer un projet
  async deleteProject(projectId) {
    try {
      const project = await Project.findByIdAndDelete(projectId);

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(`Project deleted: ${projectId}`);
      return project;
    } catch (error) {
      logger.error(`Error deleting project ${projectId}:`, error);
      throw error;
    }
  }

  // Ajouter des skills à un projet
  async addSkillsToProject(projectId, skillIds) {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { skillIds: { $each: skillIds } } },
        { new: true }
      ).populate('skillIds');

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(`Skills added to project: ${projectId}`);
      return project;
    } catch (error) {
      logger.error(`Error adding skills to project ${projectId}:`, error);
      throw error;
    }
  }

  // Retirer des skills d'un projet
  async removeSkillsFromProject(projectId, skillIds) {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $pull: { skillIds: { $in: skillIds } } },
        { new: true }
      ).populate('skillIds');

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(`Skills removed from project: ${projectId}`);
      return project;
    } catch (error) {
      logger.error(`Error removing skills from project ${projectId}:`, error);
      throw error;
    }
  }

  // Mettre à jour l'image d'un projet
  async updateProjectImage(projectId, imageFileName) {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { image: imageFileName },
        { new: true, runValidators: true }
      );

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(`Project image updated: ${projectId}`);
      return project;
    } catch (error) {
      logger.error(`Error updating project image ${projectId}:`, error);
      throw error;
    }
  }

  // Publier/Dépublier un projet
  async togglePublishProject(projectId, isPublished) {
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { isPublished },
        { new: true }
      );

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      logger.info(
        `Project ${isPublished ? 'published' : 'unpublished'}: ${projectId}`
      );
      return project;
    } catch (error) {
      logger.error(`Error toggling project publish status: ${projectId}:`, error);
      throw error;
    }
  }

  // Réordonner les projets
  async reorderProjects(projectsOrder) {
    try {
      // projectsOrder devrait être: [{ id: "123", position: 1 }, ...]
      const updates = projectsOrder.map((item) =>
        Project.findByIdAndUpdate(item.id, { position: item.position }, { new: true })
      );

      const results = await Promise.all(updates);
      logger.info('Projects reordered');
      return results;
    } catch (error) {
      logger.error('Error reordering projects:', error);
      throw error;
    }
  }

  // Rechercher des projets
  async searchProjects(query) {
    try {
      const projects = await Project.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      }).populate('skillIds', 'name');

      return projects;
    } catch (error) {
      logger.error('Error searching projects:', error);
      throw error;
    }
  }
}

export default new ProjectService();
