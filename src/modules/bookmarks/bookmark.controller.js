import bookmarkService from './bookmark.service.js';
import asyncHandler from '../../core/errors/async-handler.js';
import { sendSuccess } from '../../shared/utils/http-response.js';

class BookmarkController {
  constructor() {
    this.getAllByUser = asyncHandler(this.getAllByUser.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.create = asyncHandler(this.create.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  async getAllByUser(request, response) {
    const { bookmarks, dataSource } = await bookmarkService.getByUserId(
      request.user.id
    );
    response.setHeader('X-Data-Source', dataSource);

    sendSuccess(response, 200, 'Bookmarks retrieved successfully', {
      bookmarks,
    });
  }

  async getById(request, response) {
    const { id, jobId } = request.params;

    const data = await bookmarkService.getById(request.user.id, id, jobId);

    sendSuccess(response, 200, 'Bookmark retrieved successfully', data);
  }

  async create(request, response) {
    const { jobId } = request.params;

    const data = await bookmarkService.create(request.user.id, jobId);

    sendSuccess(response, 201, 'Bookmark created successfully', data);
  }

  async delete(request, response) {
    const { jobId } = request.params;

    await bookmarkService.deleteByJob(request.user.id, jobId);

    sendSuccess(response, 200, 'Bookmark deleted successfully');
  }
}

export default new BookmarkController();
