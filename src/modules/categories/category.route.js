import express from 'express';
import categoryController from './category.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { createSchema, updateSchema } from './category.schema.js';

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAll.bind(categoryController))
  .post(
    authMiddleware,
    validateRequestSchema(createSchema),
    categoryController.create.bind(categoryController)
  );

router
  .route('/:id')
  .get(categoryController.getById.bind(categoryController))
  .put(
    authMiddleware,
    validateRequestSchema(updateSchema),
    categoryController.update.bind(categoryController)
  )
  .delete(authMiddleware, categoryController.delete.bind(categoryController));

export default router;
