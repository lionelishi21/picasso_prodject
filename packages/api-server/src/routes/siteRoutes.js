/**
 * siteRoutes.js
 * Routes for site management
 */
import express from 'express';
import siteController from '../controllers/siteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Site CRUD operations
router.get('/user/:userId', siteController.getUserSites);
router.get('/domain/:domain', siteController.getSiteByDomain);
router.get('/:id', siteController.getSiteById);
router.post('/', siteController.createSite);
router.put('/:id', siteController.updateSite);
router.delete('/:id', siteController.deleteSite);

// Site-specific operations
router.put('/:id/menu', siteController.updateMenu);
router.put('/:id/status', siteController.updateStatus);

export default router;