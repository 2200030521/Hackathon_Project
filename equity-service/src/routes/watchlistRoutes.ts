import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:investorId', authenticateToken, getWatchlist);
router.post('/:investorId', authenticateToken, addToWatchlist);
router.delete('/:id', authenticateToken, removeFromWatchlist);

export default router;
