import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.min': 'Company name must be at least 2 characters',
    'any.required': 'Company name is required',
  }),
  description: Joi.string().optional(),
  website: Joi.string().optional(),
  logoUrl: Joi.string().optional(),
  location: Joi.string().required().messages({
    'any.required': 'Company location is required',
  }),
  industry: Joi.string().optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().optional(),
  website: Joi.string().optional(),
  logoUrl: Joi.string().optional(),
  location: Joi.string().optional(),
  industry: Joi.string().optional(),
}).min(1);

export { createSchema, updateSchema };
