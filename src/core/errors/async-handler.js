import AppError from './app-error.js';

const asyncHandler = (handler) => async (request, response, next) => {
  try {
    await handler(request, response, next);
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message, 500));
  }
};

export default asyncHandler;
