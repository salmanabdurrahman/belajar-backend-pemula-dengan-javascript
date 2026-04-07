import express from 'express';
import companyController from './company.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { createSchema, updateSchema } from './company.schema.js';

const router = express.Router();

router
  .route('/')
  .get(companyController.getAll.bind(companyController))
  .post(
    authMiddleware,
    validateRequestSchema(createSchema),
    companyController.create.bind(companyController)
  );

router
  .route('/:id')
  .get(companyController.getById.bind(companyController))
  .put(
    authMiddleware,
    validateRequestSchema(updateSchema),
    companyController.update.bind(companyController)
  )
  .delete(authMiddleware, companyController.delete.bind(companyController));

export default router;
