import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/AuthController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;
