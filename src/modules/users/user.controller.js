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

    const user = await userService.getById(id);

    sendSuccess(
      response,
      200,
      'User retrieved successfully',
      serializeUserDetail(user)
    );
  }
}

export default new UserController();
