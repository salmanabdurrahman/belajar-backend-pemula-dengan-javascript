import categoryRepository from './category.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import { isValidUuid } from '../../shared/utils/validation.js';

class CategoryService {
  async getAll() {
    try {
      const categories = await categoryRepository.findAll();
      return categories;
    } catch (error) {
      logger.error('Error fetching categories', error);
      throw new AppError('Failed to fetch categories', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Category not found', 404);
      }

      const category = await categoryRepository.findById(id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching category', error);
      throw new AppError('Failed to fetch category', 500);
    }
  }

  async create(input) {
    try {
      const category = await categoryRepository.create(input);
      logger.info(`Category created: ${category.id}`);
      return category;
    } catch (error) {
      logger.error('Error creating category', error);
      throw new AppError('Failed to create category', 500);
    }
  }

  async update(id, input) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Category not found', 404);
      }

      const existing = await categoryRepository.findById(id);
      if (!existing) {
        throw new AppError('Category not found', 404);
      }

      const categoryPayload = {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
      };

      const category = await categoryRepository.update(id, categoryPayload);
      logger.info(`Category updated: ${id}`);
      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating category', error);
      throw new AppError('Failed to update category', 500);
    }
  }

  async delete(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Category not found', 404);
      }

      const existing = await categoryRepository.findById(id);
      if (!existing) {
        throw new AppError('Category not found', 404);
      }

      const category = await categoryRepository.delete(id);
      logger.info(`Category deleted: ${id}`);
      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting category', error);
      throw new AppError('Failed to delete category', 500);
    }
  }
}

export default new CategoryService();
