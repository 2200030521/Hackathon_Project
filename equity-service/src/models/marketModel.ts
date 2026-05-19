import client from '../utility/pgManager';
import { IMarketPrice } from './types';

const getAllMarketPrices = async (): Promise<IMarketPrice[]> => {
    const result = await client.query('SELECT * FROM equity_market_prices ORDER BY stock_symbol');
    return result.rows;
};

const getMarketPrice = async (stockSymbol: string): Promise<IMarketPrice | null> => {
    const result = await client.query(
        'SELECT * FROM equity_market_prices WHERE stock_symbol = $1',
        [stockSymbol]
    );
    return result.rows[0] || null;
};

const updateMarketPrice = async (
    stockSymbol: string,
    companyName: string,
    currentPrice: number,
    dayChangePercent: number,
    exchange: string = 'NSE'
): Promise<IMarketPrice> => {
    const result = await client.query(
        `UPDATE equity_market_prices
         SET company_name = $1, current_price = $2, day_change_percent = $3, exchange = $4, updated_at = NOW()
         WHERE stock_symbol = $5 RETURNING *`,
        [companyName, currentPrice, dayChangePercent, exchange, stockSymbol]
    );
    return result.rows[0];
};

const createMarketPrice = async (
    stockSymbol: string,
    companyName: string,
    currentPrice: number,
    dayChangePercent: number,
    exchange: string = 'NSE'
): Promise<IMarketPrice> => {
    const result = await client.query(
        `INSERT INTO equity_market_prices (stock_symbol, company_name, current_price, day_change_percent, exchange)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [stockSymbol, companyName, currentPrice, dayChangePercent, exchange]
    );
    return result.rows[0];
};

export { getAllMarketPrices, getMarketPrice, updateMarketPrice, createMarketPrice };
