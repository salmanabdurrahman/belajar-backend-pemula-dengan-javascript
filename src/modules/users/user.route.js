import express from 'express';
import userController from './user.controller.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { registerSchema, updateSchema } from './user.schema.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequestSchema(registerSchema),
    userController.register.bind(userController)
  );

router.route('/:id').get(userController.getById.bind(userController));

router
  .route('/:id')
  .patch(
    authMiddleware,
    validateRequestSchema(updateSchema),
    userController.update.bind(userController)
  );

export default router;
