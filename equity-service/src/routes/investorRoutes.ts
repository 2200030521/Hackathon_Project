import express from 'express';
import { getProfile, fetchAllUsers, updateProfile } from '../controllers/investorController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', fetchAllUsers);
router.get('/:investorId', authenticateToken, getProfile);
router.put('/:investorId', authenticateToken, updateProfile);

export default router;
