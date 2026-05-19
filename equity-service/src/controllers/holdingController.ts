import { Response } from 'express';
import { getHoldingsByInvestor, getTotalPortfolioValue } from '../models/holdingModel';
import { AuthRequest } from '../middleware/authMiddleware';

const getHoldings = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const holdings = await getHoldingsByInvestor(investorId);
        const enrichedHoldings = holdings.map((holding) => {
            const invested = holding.quantity * holding.avg_buy_price;
            const marketValue = holding.quantity * holding.current_market_price;
            const gainLoss = marketValue - invested;
            const gainLossPercent = invested > 0 ? ((gainLoss / invested) * 100).toFixed(2) : '0.00';
            return { ...holding, market_value: marketValue, gain_loss: gainLoss, gain_loss_percent: gainLossPercent };
        });

        res.status(200).json({ success: true, data: enrichedHoldings, message: 'Holdings retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const getPortfolioSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const holdings = await getHoldingsByInvestor(investorId);
        const portfolioData = await getTotalPortfolioValue(investorId);

        let investedValue = 0;
        holdings.forEach((h) => {
            investedValue += h.quantity * h.avg_buy_price;
        });

        const totalValue = Number(portfolioData.total_value) || 0;
        const gainLoss = totalValue - investedValue;
        const gainLossPercent = investedValue > 0 ? ((gainLoss / investedValue) * 100).toFixed(2) : '0.00';

        const summary = {
            total_portfolio_value: totalValue,
            invested_value: investedValue,
            total_gain_loss: gainLoss,
            total_gain_loss_percent: gainLossPercent,
            holding_count: portfolioData.count,
            holdings
        };

        res.status(200).json({ success: true, data: summary, message: 'Portfolio summary retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getHoldings, getPortfolioSummary };
