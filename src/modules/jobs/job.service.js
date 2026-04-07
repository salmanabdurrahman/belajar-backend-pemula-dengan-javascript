import jobRepository from './job.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import { isValidUuid } from '../../shared/utils/validation.js';

const toDomainJob = (source = {}) => ({
  companyId: source['company_id'],
  categoryId: source['category_id'],
  title: source.title,
  description: source.description,
  requirements: source.requirements,
  salaryMin: source['salary_min'],
  salaryMax: source['salary_max'],
  jobType: source['job_type'],
  experienceLevel: source['experience_level'],
  locationType: source['location_type'],
  locationCity: source['location_city'],
  isSalaryVisible: source['is_salary_visible'],
  status: source.status,
});

const toRepositoryJobPayload = (job) => ({
  ['company_id']: job.companyId,
  ['category_id']: job.categoryId,
  title: job.title,
  description: job.description,
  requirements: job.requirements,
  ['salary_min']: job.salaryMin,
  ['salary_max']: job.salaryMax,
  ['job_type']: job.jobType,
  ['experience_level']: job.experienceLevel,
  ['location_type']: job.locationType,
  ['location_city']: job.locationCity,
  ['is_salary_visible']: job.isSalaryVisible,
  status: job.status,
});

class JobService {
  async getAll(titleQuery, companyNameQuery) {
    try {
      const jobs = await jobRepository.findAll(titleQuery, companyNameQuery);
      return jobs;
    } catch (error) {
      logger.error('Error fetching jobs', error);
      throw new AppError('Failed to fetch jobs', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Job not found', 404);
      }

      const job = await jobRepository.findById(id);
      if (!job) {
        throw new AppError('Job not found', 404);
      }

      return job;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching job', error);
      throw new AppError('Failed to fetch job', 500);
    }
  }

  async getByCompanyId(companyId) {
    try {
      if (!isValidUuid(companyId)) {
        return [];
      }

      const jobs = await jobRepository.findByCompanyId(companyId);
      return jobs;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching jobs by company', error);
      throw new AppError('Failed to fetch jobs', 500);
    }
  }

  async getByCategoryId(categoryId) {
    try {
      if (!isValidUuid(categoryId)) {
        return [];
      }

      const jobs = await jobRepository.findByCategoryId(categoryId);
      return jobs;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching jobs by category', error);
      throw new AppError('Failed to fetch jobs', 500);
    }
  }

  async create(input) {
    try {
      const domainInput = toDomainJob(input);
      const jobPayload = toRepositoryJobPayload({
        ...domainInput,
        jobType: domainInput.jobType ?? 'Full-time',
        status: domainInput.status ?? 'Open',
      });
      const job = await jobRepository.create(jobPayload);
      logger.info(`Job created: ${job.id}`);
      return job;
    } catch (error) {
      logger.error('Error creating job', error);
      throw new AppError('Failed to create job', 500);
    }
  }

  async update(id, input) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Job not found', 404);
      }

      const existing = await jobRepository.findById(id);
      if (!existing) {
        throw new AppError('Job not found', 404);
      }

      const domainInput = toDomainJob(input);
      const existingJob = toDomainJob(existing);
      const jobPayload = toRepositoryJobPayload({
        companyId: domainInput.companyId ?? existingJob.companyId,
        categoryId: domainInput.categoryId ?? existingJob.categoryId,
        title: domainInput.title ?? existingJob.title,
        description: domainInput.description ?? existingJob.description,
        requirements: domainInput.requirements ?? existingJob.requirements,
        salaryMin: domainInput.salaryMin ?? existingJob.salaryMin,
        salaryMax: domainInput.salaryMax ?? existingJob.salaryMax,
        jobType: domainInput.jobType ?? existingJob.jobType,
        experienceLevel:
          domainInput.experienceLevel ?? existingJob.experienceLevel,
        locationType: domainInput.locationType ?? existingJob.locationType,
        locationCity: domainInput.locationCity ?? existingJob.locationCity,
        isSalaryVisible:
          domainInput.isSalaryVisible ?? existingJob.isSalaryVisible,
        status: domainInput.status ?? existingJob.status,
      });

      const job = await jobRepository.update(id, jobPayload);
      logger.info(`Job updated: ${id}`);
      return job;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating job', error);
      throw new AppError('Failed to update job', 500);
    }
  }

  async delete(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Job not found', 404);
      }

      const existing = await jobRepository.findById(id);
      if (!existing) {
        throw new AppError('Job not found', 404);
      }

      const job = await jobRepository.delete(id);
      logger.info(`Job deleted: ${id}`);
      return job;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting job', error);
      throw new AppError('Failed to delete job', 500);
    }
  }
}

export default new JobService();
