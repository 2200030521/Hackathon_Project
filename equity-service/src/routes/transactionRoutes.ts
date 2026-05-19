import express from 'express';
import { getTransactions, buyStock, sellStock } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:investorId', authenticateToken, getTransactions);
router.post('/buy', authenticateToken, buyStock);
router.post('/sell', authenticateToken, sellStock);

export default router;
