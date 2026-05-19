import { Request, Response, NextFunction } from 'express';
import { getTraceId } from './telemetry';

const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const traceId = getTraceId();
    if (traceId) {
        res.setHeader('X-Trace-Id', traceId);
        res.locals.traceId = traceId;
    }
    next();
};

export default traceIdMiddleware;
