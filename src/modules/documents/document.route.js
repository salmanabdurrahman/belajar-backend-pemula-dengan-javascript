import express from 'express';
import documentController from './document.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import uploadDocumentMiddleware from './document-upload.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(documentController.getAll.bind(documentController))
  .post(
    authMiddleware,
    uploadDocumentMiddleware,
    documentController.create.bind(documentController)
  );

router
  .route('/:id')
  .get(documentController.getById.bind(documentController))
  .delete(authMiddleware, documentController.delete.bind(documentController));

export default router;
