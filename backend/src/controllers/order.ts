import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { CreateOrderDto } from '../dto/order.dto';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData: CreateOrderDto = req.body;

      // Проверка существования товаров и их цен
      const products = await Product.find({
        _id: { $in: orderData.items },
      }).select('_id price');

      // Проверяем, что найдены все товары
      if (products.length !== orderData.items.length) {
        const foundIds = products.map((p) => p._id.toString());
        const missingIds = orderData.items.filter((id) => !foundIds.includes(id));
        return next(new NotFoundError(`Товары не найдены: ${missingIds.join(', ')}`));
      }

      // Проверка, что все товары продаются (price !== null)
      const unavailableProducts = products.filter((p) => p.price === null);
      if (unavailableProducts.length > 0) {
        const unavailableIds = unavailableProducts.map((p) => p._id.toString());
        return next(new BadRequestError(`Товары недоступны для продажи: ${unavailableIds.join(', ')}`));
      }

      // Расчет общей суммы и проверка с переданным total
      const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
      const tolerance = 0.01;
      const isTotalValid = Math.abs(calculatedTotal - orderData.total) <= tolerance;

      if (!isTotalValid) {
        return next(new BadRequestError(`Несоответствие суммы заказа. Рассчитано: ${calculatedTotal}, получено: ${orderData.total}`));
      }

      // Генерация ID заказа
      const orderId = faker.string.uuid();

      return res.status(201).json({
        id: orderId,
        total: orderData.total,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default OrderController;
