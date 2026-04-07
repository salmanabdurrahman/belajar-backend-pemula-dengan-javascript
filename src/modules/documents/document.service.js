import documentRepository from './document.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import fs from 'fs';
import path from 'path';
import { isValidUuid } from '../../shared/utils/validation.js';

class DocumentService {
  async getAll() {
    try {
      const documents = await documentRepository.findAll();
      return documents;
    } catch (error) {
      logger.error('Error fetching documents', error);
      throw new AppError('Failed to fetch documents', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Document not found', 404);
      }

      const document = await documentRepository.findById(id);
      if (!document) {
        throw new AppError('Document not found', 404);
      }

      return document;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching document', error);
      throw new AppError('Failed to fetch document', 500);
    }
  }

  async create(userId, file) {
    try {
      if (!file) {
        throw new AppError('Document file is required', 400);
      }

      const document = await documentRepository.create({
        userId,
        fileName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      logger.info(`Document created: ${document.id}`);
      return document;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating document', error);
      throw new AppError('Failed to create document', 500);
    }
  }

  async delete(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Document not found', 404);
      }

      const existing = await documentRepository.findById(id);
      if (!existing) {
        throw new AppError('Document not found', 404);
      }

      const absolutePath = path.resolve(existing.file_path);
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      } else {
        logger.warn('Document file not found on disk', {
          path: existing.file_path,
        });
      }

      await documentRepository.delete(id);
      logger.info(`Document deleted: ${id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting document', error);
      throw new AppError('Failed to delete document', 500);
    }
  }
}

export default new DocumentService();
