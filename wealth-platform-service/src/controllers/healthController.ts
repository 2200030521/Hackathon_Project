import { Request, Response } from 'express';
import { checkHealth } from '../services/healthService';

export const getHealthHandler = async (_req: Request, res: Response) => {
    try {
        const data = await checkHealth();
        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
