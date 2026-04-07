import bcrypt from 'bcrypt';
import authRepository from './auth.repository.js';
import userRepository from '../users/user.repository.js';
import config from '../../config/env.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt.js';

const ensureAccessTokenKey = () => {
  if (!config.accessTokenKey) {
    throw new AppError('Access token key is not configured', 500);
  }
};

const ensureRefreshTokenKey = () => {
  if (!config.refreshTokenKey) {
    throw new AppError('Refresh token key is not configured', 500);
  }
};

class AuthService {
  async login(input) {
    try {
      ensureAccessTokenKey();
      ensureRefreshTokenKey();

      const { email, password } = input;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new AppError('Invalid email or password', 401);
      }

      const accessToken = generateAccessToken({ id: user.id });
      const refreshToken = generateRefreshToken({ id: user.id });

      await authRepository.addRefreshToken(refreshToken, user.id);
      logger.info(`User logged in: ${user.id}`);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error logging in', error);
      throw new AppError('Failed to login', 500);
    }
  }

  async refreshAccessToken(input) {
    try {
      ensureAccessTokenKey();
      ensureRefreshTokenKey();

      const { refreshToken } = input;

      let payload;

      try {
        payload = verifyRefreshToken(refreshToken);
      } catch {
        throw new AppError('Refresh token is invalid', 400);
      }

      if (!payload?.id) {
        throw new AppError('Refresh token payload is invalid', 400);
      }

      const storedToken = await authRepository.findRefreshToken(refreshToken);
      if (!storedToken) {
        throw new AppError('Refresh token is invalid', 400);
      }

      const accessToken = generateAccessToken({ id: payload.id });

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error refreshing access token', error);
      throw new AppError('Failed to refresh access token', 500);
    }
  }

  async logout(input) {
    try {
      ensureRefreshTokenKey();

      const { refreshToken } = input;

      const storedToken = await authRepository.findRefreshToken(refreshToken);
      if (!storedToken) {
        throw new AppError('Refresh token is invalid', 400);
      }

      await authRepository.deleteRefreshToken(refreshToken);
      logger.info(`User logged out: ${storedToken.user_id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error logging out', error);
      throw new AppError('Failed to logout', 500);
    }
  }
}

export default new AuthService();
