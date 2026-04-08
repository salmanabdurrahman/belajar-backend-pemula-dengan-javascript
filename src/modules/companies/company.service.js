import companyRepository from './company.repository.js';
import logger from '../../config/logger.js';
import AppError from '../../core/errors/app-error.js';
import { isValidUuid } from '../../shared/utils/validation.js';
import cacheService from '../../shared/utils/cache.js';
import cacheKeys from '../../shared/utils/cache-keys.js';

class CompanyService {
  async getAll() {
    try {
      const companies = await companyRepository.findAll();
      return companies;
    } catch (error) {
      logger.error('Error fetching companies', error);
      throw new AppError('Failed to fetch companies', 500);
    }
  }

  async getById(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Company not found', 404);
      }

      const cacheKey = cacheKeys.companyById(id);
      const cachedCompany = await cacheService.get(cacheKey);
      if (cachedCompany) {
        return {
          company: cachedCompany,
          dataSource: 'cache',
        };
      }

      const company = await companyRepository.findById(id);
      if (!company) {
        throw new AppError('Company not found', 404);
      }

      await cacheService.set(cacheKey, company);

      return {
        company,
        dataSource: 'database',
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching company', error);
      throw new AppError('Failed to fetch company', 500);
    }
  }

  async create(ownerUserId, input) {
    try {
      if (!isValidUuid(ownerUserId)) {
        throw new AppError('User not found', 404);
      }

      const company = await companyRepository.create({
        ...input,
        ownerUserId,
      });
      await cacheService.del(cacheKeys.companyById(company.id));
      logger.info(`Company created: ${company.id}`);
      return company;
    } catch (error) {
      logger.error('Error creating company', error);
      throw new AppError('Failed to create company', 500);
    }
  }

  async update(id, input) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Company not found', 404);
      }

      const existing = await companyRepository.findById(id);
      if (!existing) {
        throw new AppError('Company not found', 404);
      }

      const companyPayload = {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        website: input.website ?? existing.website,
        logoUrl: input.logoUrl ?? existing.logo_url,
        location: input.location ?? existing.location,
        industry: input.industry ?? existing.industry,
      };

      const company = await companyRepository.update(id, companyPayload);
      await cacheService.del(cacheKeys.companyById(id));
      logger.info(`Company updated: ${id}`);
      return company;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating company', error);
      throw new AppError('Failed to update company', 500);
    }
  }

  async delete(id) {
    try {
      if (!isValidUuid(id)) {
        throw new AppError('Company not found', 404);
      }

      const existing = await companyRepository.findById(id);
      if (!existing) {
        throw new AppError('Company not found', 404);
      }

      const company = await companyRepository.delete(id);
      await cacheService.del(cacheKeys.companyById(id));
      logger.info(`Company deleted: ${id}`);
      return company;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting company', error);
      throw new AppError('Failed to delete company', 500);
    }
  }
}

export default new CompanyService();
