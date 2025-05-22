/**
 * themeRoutes.js
 * Routes for theme management
 */
import express from 'express';
import themeController from '../controllers/themeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Theme CRUD operations
router.get('/', themeController.getAllThemes);
router.get('/:id', themeController.getThemeById);
router.post('/', themeController.createTheme);
router.put('/:id', themeController.updateTheme);
router.delete('/:id', themeController.deleteTheme);

export default router;