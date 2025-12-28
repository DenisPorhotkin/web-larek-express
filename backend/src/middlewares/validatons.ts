import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).allow(null).optional(),
  }),
}, { abortEarly: false });

// Валидация ID для маршрута GET /product/:id
export const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  }),
}, { abortEarly: false });

export const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().min(1).max(500).required(),
    total: Joi.number().positive().required(),
    items: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required(),
  }),
}, { abortEarly: false });
