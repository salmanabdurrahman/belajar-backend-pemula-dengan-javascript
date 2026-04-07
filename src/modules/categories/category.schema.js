import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.min': 'Category name must be at least 2 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().optional(),
}).min(1);

export { createSchema, updateSchema };
