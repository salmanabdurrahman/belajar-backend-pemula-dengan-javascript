import categoryService from './category.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class CategoryController {
  constructor() {
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAll(request, response) {
    const categories = await categoryService.getAll();

    sendSuccess(response, 200, 'Categories retrieved successfully', {
      categories,
    });
  }

  async getById(request, response) {
    const { id } = request.params;

    const data = await categoryService.getById(id);

    sendSuccess(response, 200, 'Category retrieved successfully', data);
  }

  async create(request, response) {
    const data = await categoryService.create(request.body);

    sendSuccess(response, 201, 'Category created successfully', data);
  }

  async update(request, response) {
    const { id } = request.params;

    const data = await categoryService.update(id, request.body);

    sendSuccess(response, 200, 'Category updated successfully', data);
  }

  async delete(request, response) {
    const { id } = request.params;

    await categoryService.delete(id);

    sendSuccess(response, 200, 'Category deleted successfully');
  }
}

export default new CategoryController();
