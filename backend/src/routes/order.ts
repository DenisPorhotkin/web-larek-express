import { Router } from 'express';
import OrderController from '../controllers/order';
import { validateCreateOrder } from '../middlewares/validatons';

const router = Router();

router.post('/', validateCreateOrder, OrderController.createOrder);

export default router;
