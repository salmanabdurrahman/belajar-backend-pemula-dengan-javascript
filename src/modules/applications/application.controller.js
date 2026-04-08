import applicationService from './application.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class ApplicationController {
  constructor() {
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.getByUserId = asyncHandler(this.getByUserId.bind(this));
    this.getByJobId = asyncHandler(this.getByJobId.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAll(request, response) {
    const applications = await applicationService.getAll();

    sendSuccess(response, 200, 'Applications retrieved successfully', {
      applications,
    });
  }

  async getById(request, response) {
    const { id } = request.params;

    const { application, dataSource } = await applicationService.getById(id);
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(
      response,
      200,
      'Application retrieved successfully',
      application
    );
  }

  async getByUserId(request, response) {
    const { userId } = request.params;

    const { applications, dataSource } =
      await applicationService.getByUserId(userId);
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(response, 200, 'User applications retrieved successfully', {
      applications,
    });
  }

  async getByJobId(request, response) {
    const { jobId } = request.params;

    const { applications, dataSource } =
      await applicationService.getByJobId(jobId);
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(response, 200, 'Job applications retrieved successfully', {
      applications,
    });
  }

  async create(request, response) {
    const data = await applicationService.create(request.user.id, request.body);

    sendSuccess(response, 201, 'Application created successfully', data);
  }

  async update(request, response) {
    const { id } = request.params;

    const data = await applicationService.updateStatus(id, request.body);

    sendSuccess(response, 200, 'Application updated successfully', data);
  }

  async delete(request, response) {
    const { id } = request.params;

    await applicationService.delete(id);

    sendSuccess(response, 200, 'Application deleted successfully');
  }
}

export default new ApplicationController();
