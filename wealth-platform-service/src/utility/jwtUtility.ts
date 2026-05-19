import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'platform_jwt_secret';
const EXPIRY = process.env.JWT_EXPIRY || '15m';

const signToken = (payload: any) => jwt.sign(payload, SECRET, { expiresIn: EXPIRY as SignOptions['expiresIn'] });

const verifyToken = (token: string) => jwt.verify(token, SECRET);

export { signToken, verifyToken };
