import client from '../utility/pgManager';
import { IEquityTransaction } from './types';

const getTransactionsByInvestor = async (
    investorId: string,
    limit: number = 50,
    offset: number = 0
): Promise<IEquityTransaction[]> => {
    const result = await client.query(
        `SELECT * FROM equity_transactions
         WHERE investor_id = $1 ORDER BY executed_at DESC LIMIT $2 OFFSET $3`,
        [investorId, limit, offset]
    );
    return result.rows;
};

const createTransaction = async (
    investorId: string,
    stockSymbol: string,
    transactionType: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    exchange: string = 'NSE',
    realizedGain: number | null = null
): Promise<IEquityTransaction> => {
    const result = await client.query(
        `INSERT INTO equity_transactions
         (investor_id, stock_symbol, transaction_type, quantity, price, exchange, realized_gain, executed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
        [investorId, stockSymbol, transactionType, quantity, price, exchange, realizedGain]
    );
    return result.rows[0];
};

const getTransactionById = async (transactionId: number): Promise<IEquityTransaction | null> => {
    const result = await client.query('SELECT * FROM equity_transactions WHERE id = $1', [transactionId]);
    return result.rows[0] || null;
};

const getTransactionCount = async (investorId: string): Promise<number> => {
    const result = await client.query(
        'SELECT COUNT(*)::int AS count FROM equity_transactions WHERE investor_id = $1',
        [investorId]
    );
    return result.rows[0].count;
};

export { getTransactionsByInvestor, createTransaction, getTransactionById, getTransactionCount };
