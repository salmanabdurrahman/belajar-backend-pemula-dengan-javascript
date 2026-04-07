import documentService from './document.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class DocumentController {
  constructor() {
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAll(request, response) {
    const documents = await documentService.getAll();

    sendSuccess(response, 200, 'Documents retrieved successfully', {
      documents,
    });
  }

  async getById(request, response) {
    const { id } = request.params;

    const data = await documentService.getById(id);

    sendSuccess(response, 200, 'Document retrieved successfully', data);
  }

  async create(request, response) {
    const data = await documentService.create(request.user.id, request.file);

    sendSuccess(response, 201, 'Document uploaded successfully', data);
  }

  async delete(request, response) {
    const { id } = request.params;

    await documentService.delete(id);

    sendSuccess(response, 200, 'Document deleted successfully');
  }
}

export default new DocumentController();
