import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

import { limiter } from './middleware/rateLimitMiddleware';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware';
import { seedAdmin } from './utility/seedAdmin';

import portfolioRoutes from './routes/portfolioRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import healthRoutes from './routes/healthRoutes';

require('./utility/redisClient'); // init Redis

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);

const EQUITY_URL = process.env.EQUITY_SERVICE_URL || 'http://localhost:4001';
const MF_URL     = process.env.MF_SERVICE_URL     || 'http://localhost:4002';
const SVC_KEY    = process.env.INTERNAL_SERVICE_KEY || 'INTERNAL_WEALTH_PLATFORM_KEY';
const MF_KEY     = process.env.MF_API_KEY           || 'MF_SECRET_KEY';

// ── Generic fetch-based proxy ─────────────────────────────────────────────────
const proxyTo = (baseUrl: string, extraHeaders = {}) => async (req: any, res: any) => {
    try {
        const init: any = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders,
                ...(req.headers.authorization ? { authorization: req.headers.authorization } : {})
            }
        };
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            init.body = JSON.stringify(req.body);
        }
        const upstream = await fetch(`${baseUrl}${req.originalUrl}`, init);
        const data = await upstream.json();
        res.status(upstream.status).json(data);
    } catch (err) {
        res.status(502).json({ success: false, message: `Service unavailable: ${err.message}` });
    }
};

const equityProxy = proxyTo(EQUITY_URL, { 'x-service-key': SVC_KEY });
const mfProxy     = proxyTo(MF_URL,     { 'x-api-key': MF_KEY });


// ── Platform own routes ───────────────────────────────────────────────────────
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/serviceHealth', healthRoutes);

// ── Equity proxy (all equity-service routes) ──────────────────────────────────
app.use('/api/auth',         equityProxy);   // register, refresh, logout
app.use('/api/investors',    equityProxy);
app.use('/api/holdings',     equityProxy);
app.use('/api/transactions', equityProxy);
app.use('/api/watchlist',    equityProxy);
app.use('/api/market',       equityProxy);
app.use('/api/audit-logs',   equityProxy);   // audit logs
app.use('/api/equity',       equityProxy);   // fallback for other equity-specific routes

// ── MF proxy (all mf-service routes) ─────────────────────────────────────────
app.use('/api/funds',       mfProxy);
app.use('/api/sips',        mfProxy);
app.use('/api/customer',    mfProxy);
app.use('/api/nav',         mfProxy);
app.use('/api/transaction', mfProxy);

app.use(notFoundHandler);
app.use(errorHandler);

// ── Admin seed + start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
seedAdmin()
    .then(() => {
        const server = app.listen(PORT, () => console.log(`Wealth Platform Service running on port ${PORT}`));
        server.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') { console.error(`Port ${PORT} in use`); process.exit(1); }
        });
    })
    .catch(err => { console.error('Startup failed:', err); process.exit(1); });
