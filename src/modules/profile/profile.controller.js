import profileService from './profile.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { serializeUserDetail } from '../users/user.serializer.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class ProfileController {
  constructor() {
    this.getProfile = asyncHandler(this.getProfile.bind(this));
    this.getApplications = asyncHandler(this.getApplications.bind(this));
    this.getBookmarks = asyncHandler(this.getBookmarks.bind(this));
  }

  async getProfile(request, response) {
    const data = await profileService.getProfile(request.user.id);

    sendSuccess(
      response,
      200,
      'Profile retrieved successfully',
      serializeUserDetail(data)
    );
  }

  async getApplications(request, response) {
    const applications = await profileService.getApplications(request.user.id);

    sendSuccess(response, 200, 'Profile applications retrieved successfully', {
      applications,
    });
  }

  async getBookmarks(request, response) {
    const bookmarks = await profileService.getBookmarks(request.user.id);

    sendSuccess(response, 200, 'Profile bookmarks retrieved successfully', {
      bookmarks,
    });
  }
}

export default new ProfileController();
