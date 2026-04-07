import userRepository from '../users/user.repository.js';
import applicationRepository from '../applications/application.repository.js';
import bookmarkRepository from '../bookmarks/bookmark.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';

class ProfileService {
  async getProfile(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching profile', error);
      throw new AppError('Failed to fetch profile', 500);
    }
  }

  async getApplications(userId) {
    try {
      const applications = await applicationRepository.findByUserId(userId);
      return applications;
    } catch (error) {
      logger.error('Error fetching profile applications', error);
      throw new AppError('Failed to fetch applications', 500);
    }
  }

  async getBookmarks(userId) {
    try {
      const bookmarks = await bookmarkRepository.findByUserId(userId);
      return bookmarks;
    } catch (error) {
      logger.error('Error fetching profile bookmarks', error);
      throw new AppError('Failed to fetch bookmarks', 500);
    }
  }
}

export default new ProfileService();
