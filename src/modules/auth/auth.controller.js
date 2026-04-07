import authService from './auth.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class AuthController {
  constructor() {
    this.login = asyncHandler(this.login.bind(this));
    this.refresh = asyncHandler(this.refresh.bind(this));
    this.logout = asyncHandler(this.logout.bind(this));
  }

  async login(request, response) {
    const data = await authService.login(request.body);

    sendSuccess(response, 200, 'Login successful', data);
  }

  async refresh(request, response) {
    const data = await authService.refreshAccessToken(request.body);

    sendSuccess(response, 200, 'Access token refreshed successfully', data);
  }

  async logout(request, response) {
    await authService.logout(request.body);

    sendSuccess(response, 200, 'Logout successful');
  }
}

export default new AuthController();
