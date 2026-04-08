import companyService from './company.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class CompanyController {
  constructor() {
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAll(request, response) {
    const companies = await companyService.getAll();

    sendSuccess(response, 200, 'Companies retrieved successfully', {
      companies,
    });
  }

  async getById(request, response) {
    const { id } = request.params;

    const { company, dataSource } = await companyService.getById(id);
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(response, 200, 'Company retrieved successfully', company);
  }

  async create(request, response) {
    const data = await companyService.create(request.user.id, request.body);

    sendSuccess(response, 201, 'Company created successfully', data);
  }

  async update(request, response) {
    const { id } = request.params;

    const data = await companyService.update(id, request.body);

    sendSuccess(response, 200, 'Company updated successfully', data);
  }

  async delete(request, response) {
    const { id } = request.params;

    await companyService.delete(id);

    sendSuccess(response, 200, 'Company deleted successfully');
  }
}

export default new CompanyController();
