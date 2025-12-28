import { Router } from 'express';
import ProductsController from '../controllers/products';
import { validateCreateProduct, validateProductId } from '../middlewares/validatons';

const router = Router();

router.get('/', ProductsController.getAllProducts);
router.get('/:id', validateProductId, ProductsController.getProductById);
router.post('/', validateCreateProduct, ProductsController.createProduct);

export default router;
