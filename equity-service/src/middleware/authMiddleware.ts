import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/jwt';
import { hasActiveSession } from '../models/authModel';

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
                errors: null
            });
        }

        const payload = verifyToken(token);

        const sessionActive = await hasActiveSession(payload.id);
        if (!sessionActive) {
            return res.status(401).json({
                success: false,
                message: 'Session expired or logged out. Please login again.',
                errors: null
            });
        }

        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token',
            errors: null
        });
    }
};

export { authenticateToken };
