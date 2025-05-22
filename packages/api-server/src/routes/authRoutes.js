/**
 * authRoutes.js
 * Routes for authentication
 */
import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

// Update profile
router.put('/profile', authMiddleware, authController.updateProfile);

// Change password
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;