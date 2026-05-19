import client from './pgManager';

const generateInvestorId = async (): Promise<string> => {
    const result = await client.query('SELECT COUNT(*)::int AS count FROM equity_users');
    const nextNum = result.rows[0].count + 1;
    return `INV${String(nextNum).padStart(7, '0')}`;
};

export { generateInvestorId };
