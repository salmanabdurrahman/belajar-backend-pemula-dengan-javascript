import applicationRepository from './application.repository.js';
import jobRepository from '../jobs/job.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import { isValidUuid } from '../../shared/utils/validation.js';

const toDomainApplication = (source = {}) => ({
  jobId: source['job_id'],
  status: source.status,
  coverLetter: source['cover_letter'],
});

const toRepositoryApplicationPayload = (application) => ({
  ['user_id']: application.userId,
  ['job_id']: application.jobId,
  status: application.status,
  ['cover_letter']: application.coverLetter,
});

class ApplicationService {
  async getAll() {
    try {
      const applications = await applicationRepository.findAll();
      return applications;
    } catch (error) {
      logger.error('Error fetching applications', error);
      throw new AppError('Failed to fetch applications', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Application not found', 404);
      }

      const application = await applicationRepository.findById(id);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      return application;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching application', error);
      throw new AppError('Failed to fetch application', 500);
    }
  }

  async getByUserId(userId) {
    try {
      if (!isValidUuid(userId)) {
        return [];
      }

      const applications = await applicationRepository.findByUserId(userId);
      return applications;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching applications by user', error);
      throw new AppError('Failed to fetch applications', 500);
    }
  }

  async getByJobId(jobId) {
    try {
      if (!isValidUuid(jobId)) {
        return [];
      }

      const applications = await applicationRepository.findByJobId(jobId);
      return applications;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching applications by job', error);
      throw new AppError('Failed to fetch applications', 500);
    }
  }

  async create(userId, input) {
    try {
      if (!isValidUuid(userId)) {
        throw new AppError('User not found', 404);
      }

      const domainInput = toDomainApplication(input);

      const job = await jobRepository.findById(domainInput.jobId);
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      const existing = await applicationRepository.findByUserAndJob(
        userId,
        domainInput.jobId
      );
      if (existing) {
        throw new AppError('Application already exists for this job', 400);
      }

      const application = await applicationRepository.create(
        toRepositoryApplicationPayload({
          userId,
          jobId: domainInput.jobId,
          status: domainInput.status || 'submitted',
          coverLetter: domainInput.coverLetter,
        })
      );

      logger.info(`Application created: ${application.id}`);
      return application;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating application', error);
      throw new AppError('Failed to create application', 500);
    }
  }

  async updateStatus(id, input) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Application not found', 404);
      }

      const existing = await applicationRepository.findById(id);
      if (!existing) {
        throw new AppError('Application not found', 404);
      }

      const application = await applicationRepository.updateStatus(
        id,
        input.status
      );

      logger.info(`Application updated: ${id}`);
      return application;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating application', error);
      throw new AppError('Failed to update application', 500);
    }
  }

  async delete(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Application not found', 404);
      }

      const existing = await applicationRepository.findById(id);
      if (!existing) {
        throw new AppError('Application not found', 404);
      }

      await applicationRepository.delete(id);
      logger.info(`Application deleted: ${id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting application', error);
      throw new AppError('Failed to delete application', 500);
    }
  }
}

export default new ApplicationService();
