import { Request, Response, NextFunction } from 'express';
import logger from '../utility/logger';
import { getTraceId } from './telemetry';

export interface CustomError extends Error {
    status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const traceId = getTraceId();

    logger.error({
        type: 'error',
        traceId,
        method: req.method,
        url: req.originalUrl,
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(status).json({
        success: false,
        message,
        traceId,
        errors: null
    });
};

const notFoundHandler = (req: Request, res: Response) => {
    const traceId = getTraceId();

    logger.warn({
        type: 'not_found',
        traceId,
        method: req.method,
        url: req.originalUrl
    });

    res.status(404).json({
        success: false,
        message: 'Route not found',
        traceId,
        errors: null
    });
};

export { errorHandler, notFoundHandler };
