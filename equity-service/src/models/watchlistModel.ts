import client from '../utility/pgManager';
import { IEquityWatchlist } from './types';

const getWatchlistByInvestor = async (investorId: string): Promise<IEquityWatchlist[]> => {
    const result = await client.query(
        'SELECT * FROM equity_watchlist WHERE investor_id = $1 ORDER BY added_at DESC',
        [investorId]
    );
    return result.rows;
};

const addToWatchlist = async (
    investorId: string,
    stockSymbol: string
): Promise<IEquityWatchlist | null> => {
    const result = await client.query(
        `INSERT INTO equity_watchlist (investor_id, stock_symbol)
         VALUES ($1, $2)
         ON CONFLICT (investor_id, stock_symbol) DO NOTHING RETURNING *`,
        [investorId, stockSymbol]
    );
    return result.rows[0] || null;
};

const removeFromWatchlist = async (watchlistId: number): Promise<void> => {
    await client.query('DELETE FROM equity_watchlist WHERE id = $1', [watchlistId]);
};

const getWatchlistItem = async (
    investorId: string,
    stockSymbol: string
): Promise<IEquityWatchlist | null> => {
    const result = await client.query(
        'SELECT * FROM equity_watchlist WHERE investor_id = $1 AND stock_symbol = $2',
        [investorId, stockSymbol]
    );
    return result.rows[0] || null;
};

const isInWatchlist = async (investorId: string, stockSymbol: string): Promise<boolean> => {
    const item = await getWatchlistItem(investorId, stockSymbol);
    return !!item;
};

export { getWatchlistByInvestor, addToWatchlist, removeFromWatchlist, getWatchlistItem, isInWatchlist };
