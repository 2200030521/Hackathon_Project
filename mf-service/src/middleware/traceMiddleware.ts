import { Request, Response, NextFunction }
from "express";

import { v4 as uuidv4 } from "uuid";

export const traceMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const traceId =
        req.headers["x-trace-id"]
        || uuidv4();

    req.headers["x-trace-id"] =
        traceId as string;

    console.log(
        `TraceID: ${traceId} | ${req.method} ${req.url}`
    );

    next();
};