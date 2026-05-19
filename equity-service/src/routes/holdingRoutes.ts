import express from 'express';
import { getHoldings, getPortfolioSummary } from '../controllers/holdingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:investorId', authenticateToken, getHoldings);
router.get('/:investorId/summary', authenticateToken, getPortfolioSummary);

export default router;
