import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', authenticateToken, refresh);
router.post('/logout', authenticateToken, logout);

export default router;
