import express from 'express';
import jobController from './job.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { createSchema, updateSchema } from './job.schema.js';

const router = express.Router();

router
  .route('/')
  .get(jobController.getAll.bind(jobController))
  .post(
    authMiddleware,
    validateRequestSchema(createSchema),
    jobController.create.bind(jobController)
  );

router
  .route('/company/:companyId')
  .get(jobController.getByCompanyId.bind(jobController));

router
  .route('/category/:categoryId')
  .get(jobController.getByCategoryId.bind(jobController));

router
  .route('/:id')
  .get(jobController.getById.bind(jobController))
  .put(
    authMiddleware,
    validateRequestSchema(updateSchema),
    jobController.update.bind(jobController)
  )
  .delete(authMiddleware, jobController.delete.bind(jobController));

export default router;
