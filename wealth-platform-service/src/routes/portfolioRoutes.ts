import { Router } from 'express';
import { getPortfolioHandler } from '../controllers/portfolioController';
import authMiddleware from '../middleware/authMiddleware';
import rbacMiddleware from '../middleware/rbacMiddleware';

const router = Router();

router.get('/:investorId', authMiddleware, rbacMiddleware('ADMIN', 'INVESTOR'), getPortfolioHandler);

export default router;
