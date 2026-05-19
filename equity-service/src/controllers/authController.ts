import { Request, Response } from 'express';
import { registerUser, loginUser, refreshUserToken, logoutUser } from '../models/authModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { isValidPan } from '../utility/validators';

const register = async (req: Request, res: Response) => {
    try {
        const { email, password, full_name, pan_number, demat_account } = req.body;

        if (!email || !password || !full_name || !pan_number || !demat_account) {
            return res.status(400).json({
                success: false,
                message: 'email, password, full_name, pan_number, and demat_account are required'
            });
        }

        if (!isValidPan(pan_number)) {
            return res.status(400).json({ success: false, message: 'Invalid PAN number format' });
        }

        const user = await registerUser(email, password, full_name, pan_number, demat_account);
        res.status(201).json({ success: true, data: user, message: 'Registration successful' });
    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const result = await loginUser(email, password);
        res.status(200).json({ success: true, data: result, message: 'Login successful' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const refresh = async (req: AuthRequest, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const investorId = req.user?.id;

        if (!investorId || !refreshToken) {
            return res.status(400).json({ success: false, message: 'Investor ID and refresh token are required' });
        }

        const result = await refreshUserToken(investorId, refreshToken);
        res.status(200).json({ success: true, data: result, message: 'Token refreshed' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const logout = async (req: AuthRequest, res: Response) => {
    try {
        const investorId = req.user?.id;

        if (!investorId) {
            return res.status(401).json({ success: false, message: 'Investor ID not found' });
        }

        await logoutUser(investorId);
        res.status(200).json({ success: true, data: { message: 'Logged out' }, message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { register, login, refresh, logout };
