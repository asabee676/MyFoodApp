import { Router } from 'express';
import {
  createOrder, getClientOrders, getRiderOrders,
  getMerchantOrders, getAllOrders, updateOrder,
} from '../controllers/OrderController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/', authenticate, authorize('client'), createOrder);
router.get('/client', authenticate, authorize('client'), getClientOrders);
router.get('/rider', authenticate, authorize('rider'), getRiderOrders);
router.get('/merchant/:restaurantId', authenticate, authorize('merchant', 'admin'), getMerchantOrders);
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.put('/:id', authenticate, updateOrder);

export default router;
