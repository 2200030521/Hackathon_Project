import express from 'express';
import { getTransactions, buyStock, sellStock } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST routes must come before /:investorId to avoid route conflicts
router.post('/buy', authenticateToken, buyStock);
router.post('/sell', authenticateToken, sellStock);
router.get('/:investorId', authenticateToken, getTransactions);

export default router;
