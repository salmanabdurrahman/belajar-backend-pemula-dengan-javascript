import express from 'express';
import profileController from './profile.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, profileController.getProfile.bind(profileController));

router
  .route('/applications')
  .get(authMiddleware, profileController.getApplications.bind(profileController));

router
  .route('/bookmarks')
  .get(authMiddleware, profileController.getBookmarks.bind(profileController));

export default router;
