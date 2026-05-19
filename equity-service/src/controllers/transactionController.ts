import { Response } from 'express';
import { getTransactionsByInvestor, createTransaction, getTransactionCount } from '../models/transactionModel';
import { getHoldingBySymbol, createHolding, updateHolding, deleteHolding } from '../models/holdingModel';
import { getMarketPrice } from '../models/marketModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { isValidStockSymbol } from '../utility/validators';

const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const transactions = await getTransactionsByInvestor(investorId, limit, (page - 1) * limit);
        const total = await getTransactionCount(investorId);
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: { transactions, pagination: { page, limit, total, pages } },
            message: 'Transactions retrieved'
        });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const buyStock = async (req: AuthRequest, res: Response) => {
    try {
        const { stock_symbol, quantity, price, exchange } = req.body;
        const investorId = req.user?.id;

        if (!investorId) {
            return res.status(401).json({ success: false, message: 'Investor ID not found' });
        }
        if (!stock_symbol || !isValidStockSymbol(stock_symbol)) {
            return res.status(400).json({ success: false, message: 'Invalid stock symbol' });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
        }
        if (!price || price <= 0) {
            return res.status(400).json({ success: false, message: 'Price must be positive' });
        }

        const tradeExchange = exchange || 'NSE';
        const marketPrice = await getMarketPrice(stock_symbol);
        const currentMarketPrice = marketPrice?.current_price ?? price;

        const existingHolding = await getHoldingBySymbol(investorId, stock_symbol);

        if (existingHolding) {
            const newQuantity = Number(existingHolding.quantity) + Number(quantity);
            const newAvgBuyPrice =
                (Number(existingHolding.quantity) * Number(existingHolding.avg_buy_price) +
                    Number(quantity) * Number(price)) /
                newQuantity;
            await updateHolding(investorId, stock_symbol, newQuantity, newAvgBuyPrice, currentMarketPrice);
        } else {
            await createHolding(
                investorId,
                stock_symbol,
                quantity,
                price,
                currentMarketPrice,
                tradeExchange
            );
        }

        const transaction = await createTransaction(
            investorId,
            stock_symbol,
            'BUY',
            quantity,
            price,
            tradeExchange
        );

        res.status(201).json({ success: true, data: transaction, message: 'Stock purchased successfully' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const sellStock = async (req: AuthRequest, res: Response) => {
    try {
        const { stock_symbol, quantity, price, exchange } = req.body;
        const investorId = req.user?.id;

        if (!investorId) {
            return res.status(401).json({ success: false, message: 'Investor ID not found' });
        }
        if (!stock_symbol || !isValidStockSymbol(stock_symbol)) {
            return res.status(400).json({ success: false, message: 'Invalid stock symbol' });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
        }
        if (!price || price <= 0) {
            return res.status(400).json({ success: false, message: 'Price must be positive' });
        }

        const holding = await getHoldingBySymbol(investorId, stock_symbol);

        if (!holding || Number(holding.quantity) < Number(quantity)) {
            return res.status(400).json({ success: false, message: 'Insufficient shares to sell' });
        }

        const tradeExchange = exchange || 'NSE';
        const marketPrice = await getMarketPrice(stock_symbol);
        const currentMarketPrice = marketPrice?.current_price ?? price;
        const realizedGain = (Number(price) - Number(holding.avg_buy_price)) * Number(quantity);
        const newQuantity = Number(holding.quantity) - Number(quantity);

        if (newQuantity === 0) {
            await deleteHolding(investorId, stock_symbol);
        } else {
            await updateHolding(
                investorId,
                stock_symbol,
                newQuantity,
                Number(holding.avg_buy_price),
                currentMarketPrice
            );
        }

        const transaction = await createTransaction(
            investorId,
            stock_symbol,
            'SELL',
            quantity,
            price,
            tradeExchange,
            realizedGain
        );

        res.status(201).json({ success: true, data: transaction, message: 'Stock sold successfully' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getTransactions, buyStock, sellStock };
