import Joi from 'joi';

const registerSchema = Joi.object()
  .keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be valid',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    name: Joi.string().min(3).required().messages({
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().optional(),
    role: Joi.string().optional(),
  })
  .unknown(false);

const updateSchema = Joi.object()
  .keys({
    name: Joi.string().min(3).optional(),
    phoneNumber: Joi.string().optional(),
    bio: Joi.string().optional(),
  })
  .min(1);

export { registerSchema, updateSchema };
