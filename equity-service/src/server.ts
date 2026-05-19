import './middleware/telemetry';

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { trace } from '@opentelemetry/api';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { limiter } from './middleware/rateLimitMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import traceIdMiddleware from './middleware/traceIdMiddleware';
import { getTraceId } from './middleware/telemetry';
import logger from './utility/logger';

import authRoutes from './routes/authRoutes';
import investorRoutes from './routes/investorRoutes';
import holdingRoutes from './routes/holdingRoutes';
import transactionRoutes from './routes/transactionRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import marketRoutes from './routes/marketRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(traceIdMiddleware);
app.use(loggerMiddleware);
app.use(limiter);

app.get('/health', (req: Request, res: Response) => {
    const span = trace.getTracer('equity-service').startSpan('health_check');
    const traceId = span.spanContext().traceId;

    res.json({
        service: 'equity-service',
        status: 'UP',
        timestamp: new Date(),
        traceId
    });

    span.end();
});

app.use('/api/auth', authRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/market', marketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    logger.info({
        type: 'startup',
        message: `Equity Service running on port ${PORT}`,
        traceId: getTraceId()
    });
});

export default app;
