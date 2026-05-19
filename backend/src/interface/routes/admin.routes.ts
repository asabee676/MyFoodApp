import { Router } from 'express';
import { getStats } from '../controllers/AdminController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getStats);

export default router;
