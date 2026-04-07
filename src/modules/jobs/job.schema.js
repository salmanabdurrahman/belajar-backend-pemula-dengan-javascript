/* eslint-disable camelcase */
import Joi from 'joi';

const createSchema = Joi.object({
  company_id: Joi.string().uuid().required().messages({
    'any.required': 'Company ID is required',
  }),
  category_id: Joi.string().uuid().required().messages({
    'any.required': 'Category ID is required',
  }),
  title: Joi.string().min(3).required().messages({
    'string.min': 'Job title must be at least 3 characters',
    'any.required': 'Job title is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Job description must be at least 10 characters',
    'any.required': 'Job description is required',
  }),
  requirements: Joi.string().optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(0).optional(),
  job_type: Joi.string().optional(),
  experience_level: Joi.string().optional(),
  location_type: Joi.string().optional(),
  location_city: Joi.string().optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().optional(),
});

const updateSchema = Joi.object({
  company_id: Joi.string().uuid().optional(),
  category_id: Joi.string().uuid().optional(),
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(10).optional(),
  requirements: Joi.string().optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(0).optional(),
  job_type: Joi.string().optional(),
  experience_level: Joi.string().optional(),
  location_type: Joi.string().optional(),
  location_city: Joi.string().optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().optional(),
}).min(1);

export { createSchema, updateSchema };
