import express from 'express';
import userController from './user.controller.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { registerSchema } from './user.schema.js';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequestSchema(registerSchema),
    userController.register.bind(userController)
  );

router.route('/:id').get(userController.getById.bind(userController));

export default router;
