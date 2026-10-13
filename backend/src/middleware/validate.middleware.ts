import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendError } from '../utils/response.js';

/**
 * Middleware validate request body theo Joi schema
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // Loại bỏ fields lạ không nằm trong schema
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join('; ');
      return sendError(res, `Dữ liệu không hợp lệ: ${errorMessages}`, 400);
    }

    req.body = value;
    next();
  };
};

/**
 * Middleware validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join('; ');
      return sendError(res, `Tham số truy vấn không hợp lệ: ${errorMessages}`, 400);
    }

    req.query = value;
    next();
  };
};
