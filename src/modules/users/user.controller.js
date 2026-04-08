import userService from './user.service.js';
import {
  serializeUserDetail,
  serializeUserSummary,
} from './user.serializer.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class UserController {
  constructor() {
    this.register = asyncHandler(this.register.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.update = asyncHandler(this.update.bind(this));
  }

  async register(request, response) {
    const user = await userService.register(request.body);

    sendSuccess(
      response,
      201,
      'User registered successfully',
      serializeUserSummary(user)
    );
  }

  async getById(request, response) {
    const { id } = request.params;

    const { user, dataSource } = await userService.getById(id);
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(
      response,
      200,
      'User retrieved successfully',
      serializeUserDetail(user)
    );
  }

  async update(request, response) {
    const { id } = request.params;
    const requestUserId = request.user.id;

    const user = await userService.update(id, request.body, requestUserId);

    sendSuccess(
      response,
      200,
      'User updated successfully',
      serializeUserDetail(user)
    );
  }
}

export default new UserController();
