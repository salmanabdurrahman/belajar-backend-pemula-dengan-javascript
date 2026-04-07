import express from 'express';
import bookmarkController from './bookmark.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/jobs/:jobId/bookmark')
  .post(authMiddleware, bookmarkController.create.bind(bookmarkController))
  .delete(authMiddleware, bookmarkController.delete.bind(bookmarkController));

router
  .route('/jobs/:jobId/bookmark/:id')
  .get(authMiddleware, bookmarkController.getById.bind(bookmarkController));

router
  .route('/bookmarks')
  .get(authMiddleware, bookmarkController.getAllByUser.bind(bookmarkController));

export default router;
