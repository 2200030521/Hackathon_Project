import rateLimit from 'express-rate-limit';
import redisClient from '../utility/redisClient';

// Simple in-memory limiter (falls back gracefully if Redis is down)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

export { limiter };
