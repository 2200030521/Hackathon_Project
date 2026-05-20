import { Router } from 'express';
import { getDashboardHandler } from '../controllers/dashboardController';
import authMiddleware from '../middleware/authMiddleware';
import rbacMiddleware from '../middleware/rbacMiddleware';

const router = Router();

router.get('/', authMiddleware, rbacMiddleware('ADMIN'), getDashboardHandler);

export default router;
