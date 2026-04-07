import express from 'express';
import applicationController from './application.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { createSchema, updateStatusSchema } from './application.schema.js';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, applicationController.getAll.bind(applicationController))
  .post(
    authMiddleware,
    validateRequestSchema(createSchema),
    applicationController.create.bind(applicationController)
  );

router
  .route('/user/:userId')
  .get(authMiddleware, applicationController.getByUserId.bind(applicationController));

router
  .route('/job/:jobId')
  .get(authMiddleware, applicationController.getByJobId.bind(applicationController));

router
  .route('/:id')
  .get(authMiddleware, applicationController.getById.bind(applicationController))
  .put(
    authMiddleware,
    validateRequestSchema(updateStatusSchema),
    applicationController.update.bind(applicationController)
  )
  .delete(authMiddleware, applicationController.delete.bind(applicationController));

export default router;
