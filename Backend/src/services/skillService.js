import Skill from '../models/Skill.js';
import { NotFoundError } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

class SkillService {
  // Créer une nouvelle skill
  async createSkill(skillData) {
    try {
      const skill = await Skill.create(skillData);
      logger.info(`Skill created: ${skill._id}`);
      return skill;
    } catch (error) {
      logger.error('Error creating skill:', error);
      throw error;
    }
  }

  // Récupérer toutes les skills
  async getAllSkills(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        sort = 'position',
        category,
        isHidden = false,
      } = filters;

      const query = { isHidden };

      if (category) {
        query.category = category;
      }

      const skip = (page - 1) * limit;

      const [skills, total] = await Promise.all([
        Skill.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Skill.countDocuments(query),
      ]);

      return {
        skills,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching skills:', error);
      throw error;
    }
  }

  // Récupérer les skills groupées par catégorie
  async getSkillsByCategory() {
    try {
      const skills = await Skill.find({ isHidden: false })
        .sort('position')
        .exec();

      const grouped = {
        frontend: [],
        backend: [],
        database: [],
        devops: [],
        mobile: [],
        other: [],
      };

      skills.forEach((skill) => {
        if (grouped[skill.category]) {
          grouped[skill.category].push(skill);
        }
      });

      return grouped;
    } catch (error) {
      logger.error('Error grouping skills by category:', error);
      throw error;
    }
  }

  // Récupérer une skill par ID
  async getSkillById(skillId) {
    try {
      const skill = await Skill.findById(skillId).populate('projects');

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      return skill;
    } catch (error) {
      logger.error(`Error fetching skill ${skillId}:`, error);
      throw error;
    }
  }

  // Mettre à jour une skill
  async updateSkill(skillId, updateData) {
    try {
      const skill = await Skill.findByIdAndUpdate(
        skillId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(`Skill updated: ${skillId}`);
      return skill;
    } catch (error) {
      logger.error(`Error updating skill ${skillId}:`, error);
      throw error;
    }
  }

  // Supprimer une skill
  async deleteSkill(skillId) {
    try {
      const skill = await Skill.findByIdAndDelete(skillId);

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(`Skill deleted: ${skillId}`);
      return skill;
    } catch (error) {
      logger.error(`Error deleting skill ${skillId}:`, error);
      throw error;
    }
  }

  // Mettre à jour l'icône d'une skill
  async updateSkillIcon(skillId, iconFileName) {
    try {
      const skill = await Skill.findByIdAndUpdate(
        skillId,
        { icon: iconFileName },
        { new: true, runValidators: true }
      );

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(`Skill icon updated: ${skillId}`);
      return skill;
    } catch (error) {
      logger.error(`Error updating skill icon ${skillId}:`, error);
      throw error;
    }
  }

  // Réordonner les skills
  async reorderSkills(skillsOrder) {
    try {
      // skillsOrder devrait être: [{ id: "123", position: 1 }, ...]
      const updates = skillsOrder.map((item) =>
        Skill.findByIdAndUpdate(item.id, { position: item.position }, { new: true })
      );

      const results = await Promise.all(updates);
      logger.info('Skills reordered');
      return results;
    } catch (error) {
      logger.error('Error reordering skills:', error);
      throw error;
    }
  }

  // Lier une skill à des projets
  async linkSkillToProjects(skillId, projectIds) {
    try {
      const skill = await Skill.findByIdAndUpdate(
        skillId,
        { $addToSet: { projects: { $each: projectIds } } },
        { new: true }
      ).populate('projects');

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(`Projects linked to skill: ${skillId}`);
      return skill;
    } catch (error) {
      logger.error(`Error linking projects to skill ${skillId}:`, error);
      throw error;
    }
  }

  // Retirer une skill des projets
  async unlinkSkillFromProjects(skillId, projectIds) {
    try {
      const skill = await Skill.findByIdAndUpdate(
        skillId,
        { $pull: { projects: { $in: projectIds } } },
        { new: true }
      ).populate('projects');

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(`Projects removed from skill: ${skillId}`);
      return skill;
    } catch (error) {
      logger.error(`Error unlinking projects from skill ${skillId}:`, error);
      throw error;
    }
  }

  // Masquer/Afficher une skill
  async toggleHideSkill(skillId, isHidden) {
    try {
      const skill = await Skill.findByIdAndUpdate(
        skillId,
        { isHidden },
        { new: true }
      );

      if (!skill) {
        throw new NotFoundError('Skill not found');
      }

      logger.info(
        `Skill ${isHidden ? 'hidden' : 'shown'}: ${skillId}`
      );
      return skill;
    } catch (error) {
      logger.error(`Error toggling skill visibility: ${skillId}:`, error);
      throw error;
    }
  }

  // Rechercher des skills
  async searchSkills(query) {
    try {
      const skills = await Skill.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      });

      return skills;
    } catch (error) {
      logger.error('Error searching skills:', error);
      throw error;
    }
  }
}

export default new SkillService();
