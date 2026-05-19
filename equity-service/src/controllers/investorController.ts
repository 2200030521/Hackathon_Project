import { Request, Response } from 'express';
import { allUsers, getUserById, updateUser } from '../models/investorModel';
import { AuthRequest } from '../middleware/authMiddleware';

const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const user = await getUserById(investorId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user, message: 'User profile retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const fetchAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await allUsers();
        res.status(200).json({ success: true, data: users, message: 'All users retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;
        const { full_name, demat_account } = req.body;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const updatedUser = await updateUser(investorId, { full_name, demat_account });
        res.status(200).json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getProfile, fetchAllUsers, updateProfile };
