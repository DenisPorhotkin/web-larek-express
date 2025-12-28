import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { CreateProductDto } from '../dto/product.dto';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

class ProductsController {
  static async getAllProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Product.find();
      return res.json({
        items: products,
        total: products.length,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return next(new NotFoundError('Товар не найден'));
      }

      return res.json(product);
    } catch (error) {
      return next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: CreateProductDto = req.body;
      const product = new Product(productData);
      await product.save();

      return res.status(201).json({
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
      });
    } catch (error: unknown) {
      if (
        error instanceof Error
        && 'code' in error
        && (error as MongoError).code === 11000
      ) {
        return next(new ConflictError('Товар с таким названием уже существует'));
      }
      return next(error);
    }
  }
}

export default ProductsController;
