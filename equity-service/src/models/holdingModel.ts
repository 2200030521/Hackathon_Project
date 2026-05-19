import client from '../utility/pgManager';
import { IEquityHolding } from './types';

const getHoldingsByInvestor = async (investorId: string): Promise<IEquityHolding[]> => {
    const result = await client.query(
        'SELECT * FROM equity_holdings WHERE investor_id = $1 ORDER BY stock_symbol',
        [investorId]
    );
    return result.rows;
};

const getHoldingBySymbol = async (
    investorId: string,
    stockSymbol: string
): Promise<IEquityHolding | null> => {
    const result = await client.query(
        'SELECT * FROM equity_holdings WHERE investor_id = $1 AND stock_symbol = $2',
        [investorId, stockSymbol]
    );
    return result.rows[0] || null;
};

const createHolding = async (
    investorId: string,
    stockSymbol: string,
    quantity: number,
    avgBuyPrice: number,
    currentMarketPrice: number,
    exchange: string = 'NSE'
): Promise<IEquityHolding> => {
    const result = await client.query(
        `INSERT INTO equity_holdings (investor_id, stock_symbol, quantity, avg_buy_price, current_market_price, exchange)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [investorId, stockSymbol, quantity, avgBuyPrice, currentMarketPrice, exchange]
    );
    return result.rows[0];
};

const updateHolding = async (
    investorId: string,
    stockSymbol: string,
    quantity: number,
    avgBuyPrice: number,
    currentMarketPrice: number
): Promise<IEquityHolding> => {
    const result = await client.query(
        `UPDATE equity_holdings
         SET quantity = $1, avg_buy_price = $2, current_market_price = $3, updated_at = NOW()
         WHERE investor_id = $4 AND stock_symbol = $5 RETURNING *`,
        [quantity, avgBuyPrice, currentMarketPrice, investorId, stockSymbol]
    );
    return result.rows[0];
};

const deleteHolding = async (investorId: string, stockSymbol: string): Promise<void> => {
    await client.query(
        'DELETE FROM equity_holdings WHERE investor_id = $1 AND stock_symbol = $2',
        [investorId, stockSymbol]
    );
};

const getTotalPortfolioValue = async (
    investorId: string
): Promise<{ total_value: number; count: number }> => {
    const result = await client.query(
        `SELECT COALESCE(SUM(quantity * current_market_price), 0) AS total_value, COUNT(*)::int AS count
         FROM equity_holdings WHERE investor_id = $1`,
        [investorId]
    );
    return result.rows[0];
};

export {
    getHoldingsByInvestor,
    getHoldingBySymbol,
    createHolding,
    updateHolding,
    deleteHolding,
    getTotalPortfolioValue
};
