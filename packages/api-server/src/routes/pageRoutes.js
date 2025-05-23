/**
 * pageRoutes.js
 * Routes for page management
 */
import express from 'express';
import * as pageController from '../controllers/pageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all pages
router.get('/', authMiddleware, pageController.getPages);

// Get a single page
router.get('/:id', authMiddleware, pageController.getPage);

router.get('/site/:siteId', authMiddleware, pageController.getPagesBySite);

// Create a new page
router.post('/', authMiddleware, pageController.createPage);

// Update a page
router.put('/:id', authMiddleware, pageController.updatePage);

// Delete a page
router.delete('/:id', authMiddleware, pageController.deletePage);

export default router;