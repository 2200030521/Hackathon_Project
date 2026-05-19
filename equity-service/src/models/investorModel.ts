import client from '../utility/pgManager';
import { IEquityUser } from './types';

const USER_COLUMNS =
    'investor_id, full_name, email, pan_number, demat_account, created_at';

const getUserById = async (investorId: string): Promise<IEquityUser | null> => {
    const result = await client.query(
        `SELECT ${USER_COLUMNS} FROM equity_users WHERE investor_id = $1`,
        [investorId]
    );
    return result.rows[0] || null;
};

const allUsers = async (): Promise<IEquityUser[]> => {
    const result = await client.query(`SELECT ${USER_COLUMNS} FROM equity_users`);
    return result.rows;
};

const getUserByEmail = async (email: string): Promise<IEquityUser | null> => {
    const result = await client.query(
        `SELECT ${USER_COLUMNS} FROM equity_users WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
};

const updateUser = async (
    investorId: string,
    updates: Partial<Pick<IEquityUser, 'full_name' | 'demat_account'>>
): Promise<IEquityUser> => {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (updates.full_name !== undefined) {
        setClauses.push(`full_name = $${paramCount++}`);
        values.push(updates.full_name);
    }
    if (updates.demat_account !== undefined) {
        setClauses.push(`demat_account = $${paramCount++}`);
        values.push(updates.demat_account);
    }

    if (setClauses.length === 0) {
        throw { status: 400, message: 'No valid fields to update' };
    }

    values.push(investorId);
    const result = await client.query(
        `UPDATE equity_users SET ${setClauses.join(', ')} WHERE investor_id = $${paramCount} RETURNING ${USER_COLUMNS}`,
        values
    );
    return result.rows[0];
};

export { getUserById, allUsers, getUserByEmail, updateUser };
