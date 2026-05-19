import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboardService';

export const getDashboardHandler = async (req: Request, res: Response) => {
    try {
        const data = await getDashboardStats();
        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
