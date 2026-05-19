import { Router } from 'express';
import {
  getAll, getById, create, update, remove,
  addMenuItem, updateMenuItem, deleteMenuItem,
} from '../controllers/RestaurantController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getAll);
router.get('/:id', getById);

// Admin/Merchant protected
router.post('/', authenticate, authorize('admin'), create);
router.put('/:id', authenticate, authorize('admin', 'merchant'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

// Menu management
router.post('/:id/menu', authenticate, authorize('admin', 'merchant'), addMenuItem);
router.put('/:id/menu/:itemId', authenticate, authorize('admin', 'merchant'), updateMenuItem);
router.delete('/:id/menu/:itemId', authenticate, authorize('admin', 'merchant'), deleteMenuItem);

export default router;
