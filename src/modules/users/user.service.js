import bcrypt from 'bcrypt';
import userRepository from './user.repository.js';
import AppError from '../../core/errors/app-error.js';
import logger from '../../config/logger.js';
import { isValidUuid } from '../../shared/utils/validation.js';
import cacheService from '../../shared/utils/cache.js';
import cacheKeys from '../../shared/utils/cache-keys.js';

class UserService {
  async register(input) {
    try {
      const { email, password, name, phoneNumber, role } = input;

      // Check if email already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await userRepository.create({
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        role,
      });

      logger.info(`User registered: ${email}`);
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error registering user', error);
      throw new AppError('Failed to register user', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('User not found', 404);
      }

      const cacheKey = cacheKeys.userById(id);
      const cachedUser = await cacheService.get(cacheKey);
      if (cachedUser) {
        return {
          user: cachedUser,
          dataSource: 'cache',
        };
      }

      const user = await userRepository.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await cacheService.set(cacheKey, user);

      return {
        user,
        dataSource: 'database',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching user', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async update(id, input, requestUserId) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('User not found', 404);
      }

      // Check authorization: user can only update their own profile
      if (id !== requestUserId) {
        throw new AppError('Forbidden: You can only update your own profile', 403);
      }

      const { name, phoneNumber, bio } = input;

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Update user
      const updatedUser = await userRepository.update(id, {
        name: name ?? existingUser.name,
        phoneNumber: phoneNumber ?? existingUser.phone_number,
        bio: bio ?? existingUser.bio,
        profilePictureUrl: existingUser.profile_picture_url,
      });

      // Invalidate cache
      const cacheKey = cacheKeys.userById(id);
      await cacheService.del(cacheKey);

      logger.info(`User updated: ${id}`);
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating user', error);
      throw new AppError('Failed to update user', 500);
    }
  }
}

export default new UserService();
