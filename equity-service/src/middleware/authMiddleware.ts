import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/jwt';
import { hasActiveSession } from '../models/authModel';

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role?: string };
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Internal service-to-service bypass (wealth-platform → equity-service)
        const serviceKey = req.headers['x-service-key'];
        if (serviceKey && serviceKey === process.env.INTERNAL_SERVICE_KEY) {
            const investorId = req.params.investorId || 'service';
            req.user = { id: investorId, email: 'internal@service' };
            return next();
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

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

        req.user = { id: payload.id, email: payload.email, role: payload.role };
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
