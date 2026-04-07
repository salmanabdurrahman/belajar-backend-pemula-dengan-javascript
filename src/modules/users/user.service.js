import bcrypt from 'bcrypt';
import userRepository from './user.repository.js';
import AppError from '../../core/errors/app-error.js';
import logger from '../../config/logger.js';
import { isValidUuid } from '../../shared/utils/validation.js';

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

      const user = await userRepository.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching user', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }
}

export default new UserService();
