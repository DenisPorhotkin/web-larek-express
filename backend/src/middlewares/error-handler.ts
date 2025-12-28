import { Request, Response, NextFunction } from 'express';
import { CelebrateError } from 'celebrate';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Внутренняя ошибка сервера';

  if (error instanceof CelebrateError) {
    statusCode = 400;
    message = 'Ошибка валидации данных';
  } else if (error instanceof BadRequestError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof NotFoundError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ConflictError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Ошибка валидации данных при создании товара';
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Некорректный ID';
  }

  // В development режиме выводим ошибку в консоль
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    process.stderr.write(`Ошибка: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`Stack: ${error.stack}\n`);
    }
  }

  res.status(statusCode).json({ message });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Маршрут ${req.originalUrl} не найден`));
};
