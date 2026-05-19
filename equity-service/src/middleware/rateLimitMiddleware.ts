import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

export default limiter;
