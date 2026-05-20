import { Request, Response } from 'express';
import { getPortfolio } from '../services/portfolioService';

export const getPortfolioHandler = async (req: Request, res: Response) => {
    try {
        const data = await getPortfolio(req.params.investorId);
        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
