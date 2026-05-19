import { Response } from 'express';
import {
    getWatchlistByInvestor,
    addToWatchlist as addToWatchlistModel,
    removeFromWatchlist as removeFromWatchlistModel,
    getWatchlistItem
} from '../models/watchlistModel';
import { getMarketPrice } from '../models/marketModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { isValidStockSymbol } from '../utility/validators';

const getWatchlist = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }

        const watchlist = await getWatchlistByInvestor(investorId);
        const enrichedWatchlist = await Promise.all(
            watchlist.map(async (item) => {
                const marketPrice = await getMarketPrice(item.stock_symbol);
                return {
                    ...item,
                    company_name: marketPrice?.company_name || null,
                    current_price: marketPrice?.current_price || 0,
                    day_change_percent: marketPrice?.day_change_percent || 0,
                    exchange: marketPrice?.exchange || 'NSE'
                };
            })
        );

        res.status(200).json({ success: true, data: enrichedWatchlist, message: 'Watchlist retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const addToWatchlist = async (req: AuthRequest, res: Response) => {
    try {
        const { investorId } = req.params;
        const { stock_symbol } = req.body;

        if (!investorId) {
            return res.status(400).json({ success: false, message: 'Investor ID is required' });
        }
        if (!stock_symbol || !isValidStockSymbol(stock_symbol)) {
            return res.status(400).json({ success: false, message: 'Invalid stock symbol' });
        }

        const isDuplicate = await getWatchlistItem(investorId, stock_symbol);
        if (isDuplicate) {
            return res.status(409).json({ success: false, message: 'Symbol already in watchlist' });
        }

        const item = await addToWatchlistModel(investorId, stock_symbol);
        if (!item) {
            return res.status(409).json({ success: false, message: 'Symbol already in watchlist' });
        }

        const marketPrice = await getMarketPrice(stock_symbol);
        const enrichedItem = {
            ...item,
            company_name: marketPrice?.company_name || null,
            current_price: marketPrice?.current_price || 0,
            day_change_percent: marketPrice?.day_change_percent || 0
        };

        res.status(201).json({ success: true, data: enrichedItem, message: 'Stock added to watchlist' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Watchlist ID is required' });
        }

        await removeFromWatchlistModel(parseInt(id, 10));
        res.status(200).json({ success: true, data: { id }, message: 'Stock removed from watchlist' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getWatchlist, addToWatchlist, removeFromWatchlist };
