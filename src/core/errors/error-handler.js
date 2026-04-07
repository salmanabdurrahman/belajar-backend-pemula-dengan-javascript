import logger from '../../config/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  logger.error(message, { statusCode, error: error.stack });

  response.status(statusCode).json({
    status: 'failed',
    message,
    statusCode,
  });
};

export default errorHandler;
