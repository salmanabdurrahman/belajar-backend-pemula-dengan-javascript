import AppError from '../errors/app-error.js';

const validateRequestSchema = (schema) => {
  return (request, response, next) => {
    const { error, value } = schema.validate(request.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(message, 400));
    }

    request.body = value;
    next();
  };
};

export default validateRequestSchema;
