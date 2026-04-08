import bookmarkRepository from './bookmark.repository.js';
import jobRepository from '../jobs/job.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import { isValidUuid } from '../../shared/utils/validation.js';
import cacheService from '../../shared/utils/cache.js';
import cacheKeys from '../../shared/utils/cache-keys.js';

class BookmarkService {
  async getById(userId, id, jobId) {
    try {
      if (!isValidUuid(id) || !isValidUuid(jobId)) {
        throw new AppError('Bookmark not found', 404);
      }

      const bookmark = await bookmarkRepository.findById(id);
      if (
        !bookmark ||
        bookmark.job_id !== jobId ||
        bookmark.user_id !== userId
      ) {
        throw new AppError('Bookmark not found', 404);
      }

      return bookmark;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching bookmark', error);
      throw new AppError('Failed to fetch bookmark', 500);
    }
  }

  async getByUserId(userId) {
    try {
      if (!isValidUuid(userId)) {
        throw new AppError('User not found', 404);
      }

      const cacheKey = cacheKeys.bookmarksByUserId(userId);
      const cachedBookmarks = await cacheService.get(cacheKey);
      if (cachedBookmarks) {
        return {
          bookmarks: cachedBookmarks,
          dataSource: 'cache',
        };
      }

      const bookmarks = await bookmarkRepository.findByUserId(userId);
      await cacheService.set(cacheKey, bookmarks);

      return {
        bookmarks,
        dataSource: 'database',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching bookmarks', error);
      throw new AppError('Failed to fetch bookmarks', 500);
    }
  }

  async create(userId, jobId) {
    try {
      if (!isValidUuid(jobId)) {
        throw new AppError('Job not found', 404);
      }

      const job = await jobRepository.findById(jobId);
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      const existing = await bookmarkRepository.findByUserAndJob(userId, jobId);
      if (existing) {
        throw new AppError('Bookmark already exists for this job', 400);
      }

      const bookmark = await bookmarkRepository.create(userId, jobId);
      await cacheService.del(cacheKeys.bookmarksByUserId(userId));
      logger.info(`Bookmark created: ${bookmark.id}`);
      return bookmark;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating bookmark', error);
      throw new AppError('Failed to create bookmark', 500);
    }
  }

  async deleteByJob(userId, jobId) {
    try {
      if (!isValidUuid(jobId)) {
        throw new AppError('Job not found', 404);
      }

      const existing = await bookmarkRepository.findByUserAndJob(userId, jobId);
      if (!existing) {
        throw new AppError('Bookmark not found', 404);
      }

      await bookmarkRepository.deleteByUserAndJob(userId, jobId);
      await cacheService.del(cacheKeys.bookmarksByUserId(userId));
      logger.info(`Bookmark deleted for job: ${jobId}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting bookmark', error);
      throw new AppError('Failed to delete bookmark', 500);
    }
  }
}

export default new BookmarkService();
