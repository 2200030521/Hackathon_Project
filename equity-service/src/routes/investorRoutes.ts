import express from 'express';
import { getProfile, fetchAllUsers, updateProfile } from '../controllers/investorController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Only admin can fetch all users
router.get('/', authenticateToken, fetchAllUsers);
router.get('/:investorId', authenticateToken, getProfile);
router.put('/:investorId', authenticateToken, updateProfile);

export default router;
