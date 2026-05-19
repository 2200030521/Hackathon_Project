import { verifyToken } from '../utility/jwtUtility';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const token = authHeader.split(' ')[1];
        req.user = verifyToken(token);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
