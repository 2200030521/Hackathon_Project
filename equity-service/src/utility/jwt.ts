import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jlkjmgfhdgfvilkyugjfhgf';

export const generateAccessToken = (userId: string, email: string, role: string = 'INVESTOR'): string => {
    return jwt.sign(
        { id: userId, email, role },
        JWT_SECRET,
        { expiresIn: '15m' } as SignOptions
    );
};

export const generateRefreshToken = (userId: string, email: string, role: string = 'INVESTOR'): string => {
    return jwt.sign(
        { id: userId, email, role },
        JWT_SECRET,
        { expiresIn: '7d' } as SignOptions
    );
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw { status: 401, message: 'Invalid token' };
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
};
