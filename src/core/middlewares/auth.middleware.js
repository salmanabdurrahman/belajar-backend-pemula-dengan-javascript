import AppError from '../errors/app-error.js';
import logger from '../../config/logger.js';
import config from '../../config/env.js';
import { verifyAccessToken } from '../../shared/utils/jwt.js';

const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    logger.warn('Missing authorization header');
    return next(new AppError('Missing authorization header', 401));
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    logger.warn('Invalid authorization format');
    return next(new AppError('Invalid authorization format', 401));
  }

  if (!config.accessTokenKey) {
    logger.error('Access token key is not configured');
    return next(new AppError('Access token key is not configured', 500));
  }

  try {
    const payload = verifyAccessToken(token);
    if (!payload?.id) {
      throw new Error('Invalid access token payload');
    }

    request.user = { id: payload.id };
    request.token = token;
    return next();
  } catch (error) {
    logger.warn('Invalid access token', { message: error.message });
    return next(new AppError('Invalid access token', 401));
  }
};

export default authMiddleware;
