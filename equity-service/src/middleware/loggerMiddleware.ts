import { Request, Response, NextFunction } from 'express';
import UAParserLib from 'ua-parser-js';
import logger from '../utility/logger';
import { getTraceId } from './telemetry';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        const ip =
            (req.headers['x-forwarded-for'] as string) ||
            req.socket.remoteAddress;

        const ua = new UAParserLib.UAParser(req.headers['user-agent'] as string).getResult();

        logger.info({
            type: 'audit',
            traceId: getTraceId(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ipAddress: ip,
            browser: ua.browser.name,
            os: ua.os.name,
            device: ua.device.model || ua.device.type || 'Desktop'
        });
    });

    next();
};

export default loggerMiddleware;
