/* eslint-disable camelcase */
import Joi from 'joi';

const createSchema = Joi.object({
  job_id: Joi.string().uuid().required().messages({
    'any.required': 'Job ID is required',
  }),
  user_id: Joi.string().uuid().optional(),
  status: Joi.string().optional(),
  cover_letter: Joi.string().optional(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().required().messages({
    'any.required': 'Status is required',
  }),
});

export { createSchema, updateStatusSchema };
