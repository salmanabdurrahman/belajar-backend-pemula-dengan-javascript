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

      const absolutePath = path.resolve(document.file_path);
      let fileBuffer;

      try {
        fileBuffer = await fs.promises.readFile(absolutePath);
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new AppError('Document not found', 404);
        }

        throw error;
      }

      return {
        fileBuffer,
        fileName: document.file_name,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching document', error);
      throw new AppError('Failed to fetch document', 500);
    }
  }

  async create(userId, file) {
    try {
      if (!file) {
        throw new AppError('File is required', 400);
      }

      if (file.mimetype !== 'application/pdf') {
        throw new AppError('Only PDF files are allowed', 400);
      }

      const document = await documentRepository.create({
        userId,
        fileName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      logger.info(`Document created: ${document.id}`);
      return {
        documentId: document.id,
        filename: path.basename(file.path),
        originalName: file.originalname,
        size: file.size,
      };
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
