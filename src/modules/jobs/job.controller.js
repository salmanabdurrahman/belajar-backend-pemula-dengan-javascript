import jobService from './job.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class JobController {
  constructor() {
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.getByCompanyId = asyncHandler(this.getByCompanyId.bind(this));
    this.getByCategoryId = asyncHandler(this.getByCategoryId.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAll(request, response) {
    const { title, 'company-name': companyName } = request.query;

    const jobs = await jobService.getAll(title, companyName);

    sendSuccess(response, 200, 'Jobs retrieved successfully', { jobs });
  }

  async getById(request, response) {
    const { id } = request.params;

    const data = await jobService.getById(id);

    sendSuccess(response, 200, 'Job retrieved successfully', data);
  }

  async getByCompanyId(request, response) {
    const { companyId } = request.params;

    const jobs = await jobService.getByCompanyId(companyId);

    sendSuccess(response, 200, 'Company jobs retrieved successfully', {
      jobs,
    });
  }

  async getByCategoryId(request, response) {
    const { categoryId } = request.params;

    const jobs = await jobService.getByCategoryId(categoryId);

    sendSuccess(response, 200, 'Category jobs retrieved successfully', {
      jobs,
    });
  }

  async create(request, response) {
    const data = await jobService.create(request.body);

    sendSuccess(response, 201, 'Job created successfully', data);
  }

  async update(request, response) {
    const { id } = request.params;

    const data = await jobService.update(id, request.body);

    sendSuccess(response, 200, 'Job updated successfully', data);
  }

  async delete(request, response) {
    const { id } = request.params;

    await jobService.delete(id);

    sendSuccess(response, 200, 'Job deleted successfully');
  }
}

export default new JobController();
