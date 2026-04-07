import Joi from 'joi';

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const refreshTokenSchema = Joi.object()
  .keys({
    refreshToken: Joi.string().optional(),
  })
  .custom((value, helpers) => {
    if (!value.refreshToken) {
      return helpers.error('any.required', { label: 'refreshToken' });
    }
    return value;
  })
  .messages({
    'any.required': 'Refresh token is required',
  });

export { loginSchema, refreshTokenSchema };
