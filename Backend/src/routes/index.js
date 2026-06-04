import express from 'express';
import projectRoutes from './projects.js';
import skillRoutes from './skills.js';
import messageRoutes from './messages.js';

const router = express.Router();

// ===========================
// API Routes
// ===========================

router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/messages', messageRoutes);

// ===========================
// Root API Info
// ===========================
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Portfolio Backend API v1.0',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      skills: '/api/skills',
      messages: '/api/messages',
    },
    documentation: 'https://github.com/your-username/portfolio#api-documentation',
  });
});

export default router;
