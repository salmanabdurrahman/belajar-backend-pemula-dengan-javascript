import express from 'express';
import authController from './auth.controller.js';
import validateRequestSchema from '../../core/middlewares/validate.middleware.js';
import { loginSchema, refreshTokenSchema } from './auth.schema.js';

const router = express.Router();

router
  .route('/')
  .post(
    validateRequestSchema(loginSchema),
    authController.login.bind(authController)
  )
  .put(
    validateRequestSchema(refreshTokenSchema),
    authController.refresh.bind(authController)
  )
  .delete(
    validateRequestSchema(refreshTokenSchema),
    authController.logout.bind(authController)
  );

export default router;
