import { Request, Response } from 'express';
import { getAllMarketPrices, getMarketPrice, updateMarketPrice, createMarketPrice } from '../models/marketModel';
import { isValidStockSymbol } from '../utility/validators';
import redisClient from '../utility/redisClient';

const CACHE_TTL = 60; // seconds

const getAllPrices = async (_req: Request, res: Response) => {
    try {
        const cacheKey = 'market:all';
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached), message: 'Market prices retrieved (cache)' });
        }

        const prices = await getAllMarketPrices();
        await redisClient.set(cacheKey, JSON.stringify(prices), { EX: CACHE_TTL });

        res.status(200).json({ success: true, data: prices, message: 'Market prices retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const getPrice = async (req: Request, res: Response) => {
    try {
        const { symbol } = req.params;
        const stockSymbol = symbol?.toUpperCase();

        if (!stockSymbol || !isValidStockSymbol(stockSymbol)) {
            return res.status(400).json({ success: false, message: 'Invalid stock symbol' });
        }

        const cacheKey = `market:${stockSymbol}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached), message: 'Market price retrieved (cache)' });
        }

        const price = await getMarketPrice(stockSymbol);
        if (!price) {
            return res.status(404).json({ success: false, message: 'Stock price not found' });
        }

        await redisClient.set(cacheKey, JSON.stringify(price), { EX: CACHE_TTL });

        res.status(200).json({ success: true, data: price, message: 'Market price retrieved' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const updatePrices = async (req: Request, res: Response) => {
    try {
        const { prices } = req.body;

        if (!Array.isArray(prices)) {
            return res.status(400).json({ success: false, message: 'Prices must be an array' });
        }

        const results = await Promise.all(
            prices.map(async (priceData: {
                stock_symbol: string;
                company_name: string;
                current_price: number;
                day_change_percent: number;
                exchange?: string;
            }) => {
                const {
                    stock_symbol,
                    company_name,
                    current_price,
                    day_change_percent,
                    exchange = 'NSE'
                } = priceData;

                if (!stock_symbol || !isValidStockSymbol(stock_symbol)) {
                    throw { status: 400, message: `Invalid stock symbol: ${stock_symbol}` };
                }
                if (!company_name || current_price == null || day_change_percent == null) {
                    throw {
                        status: 400,
                        message: 'stock_symbol, company_name, current_price, and day_change_percent are required'
                    };
                }

                const existingPrice = await getMarketPrice(stock_symbol);

                const result = existingPrice
                    ? await updateMarketPrice(stock_symbol, company_name, current_price, day_change_percent, exchange)
                    : await createMarketPrice(stock_symbol, company_name, current_price, day_change_percent, exchange);

                // Invalidate per-symbol and all-prices cache
                await redisClient.del(`market:${stock_symbol.toUpperCase()}`);
                await redisClient.del('market:all');

                return result;
            })
        );

        res.status(200).json({ success: true, data: results, message: 'Market prices updated' });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getAllPrices, getPrice, updatePrices };
