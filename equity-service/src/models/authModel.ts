import client from '../utility/pgManager';
import { hashPassword, comparePassword } from '../utility/bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utility/jwt';
import { generateInvestorId } from '../utility/investorId';
import { IEquityUser } from './types';

const REFRESH_TOKEN_DAYS = 7;

const sanitizeUser = (row: IEquityUser & { password_hash: string }): IEquityUser => {
    const { password_hash: _, ...user } = row;
    return user;
};

const storeRefreshToken = async (investorId: string, token: string): Promise<void> => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await client.query('DELETE FROM equity_refresh_tokens WHERE investor_id = $1', [investorId]);
    await client.query(
        'INSERT INTO equity_refresh_tokens (investor_id, token, expires_at) VALUES ($1, $2, $3)',
        [investorId, token, expiresAt]
    );
};

const registerUser = async (
    email: string,
    password: string,
    fullName: string,
    panNumber: string,
    dematAccount: string
): Promise<IEquityUser> => {
    const investorId = await generateInvestorId();
    const passwordHash = await hashPassword(password);

    const result = await client.query(
        `INSERT INTO equity_users (investor_id, full_name, email, pan_number, demat_account, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING investor_id, full_name, email, pan_number, demat_account, created_at`,
        [investorId, fullName, email, panNumber.toUpperCase(), dematAccount, passwordHash]
    );

    return result.rows[0];
};

const loginUser = async (
    email: string,
    password: string
): Promise<{ user: any; accessToken: string; refreshToken: string | null }> => {

    // 1. Check platform_users (ADMIN)
    const adminResult = await client.query('SELECT * FROM platform_users WHERE email = $1', [email]);
    if (adminResult.rows[0]) {
        const admin = adminResult.rows[0];
        const valid = await comparePassword(password, admin.password_hash);
        if (!valid) throw { status: 401, message: 'Invalid email or password' };

        const accessToken = generateAccessToken(admin.id, admin.email, 'ADMIN');
        return {
            user: { id: admin.id, full_name: admin.full_name, email: admin.email, role: 'ADMIN' },
            accessToken,
            refreshToken: null
        };
    }

    // 2. Check equity_users (INVESTOR)
    const result = await client.query('SELECT * FROM equity_users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        throw { status: 401, message: 'Invalid email or password' };
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
        throw { status: 401, message: 'Invalid email or password' };
    }

    const accessToken = generateAccessToken(user.investor_id, user.email, 'INVESTOR');
    const refreshToken = generateRefreshToken(user.investor_id, user.email, 'INVESTOR');

    await storeRefreshToken(user.investor_id, refreshToken);

    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
    };
};

const refreshUserToken = async (
    investorId: string,
    refreshToken: string
): Promise<{ accessToken: string }> => {
    const tokenResult = await client.query(
        `SELECT * FROM equity_refresh_tokens
         WHERE investor_id = $1 AND token = $2 AND expires_at > NOW()`,
        [investorId, refreshToken]
    );

    if (!tokenResult.rows[0]) {
        throw { status: 403, message: 'Invalid or expired refresh token' };
    }

    const userResult = await client.query(
        'SELECT investor_id, email FROM equity_users WHERE investor_id = $1',
        [investorId]
    );
    const user = userResult.rows[0];

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    const newAccessToken = generateAccessToken(user.investor_id, user.email);
    return { accessToken: newAccessToken };
};

const logoutUser = async (investorId: string): Promise<void> => {
    await client.query('DELETE FROM equity_refresh_tokens WHERE investor_id = $1', [investorId]);
};

const hasActiveSession = async (investorId: string): Promise<boolean> => {
    const result = await client.query(
        `SELECT 1 FROM equity_refresh_tokens
         WHERE investor_id = $1 AND expires_at > NOW() LIMIT 1`,
        [investorId]
    );
    return result.rows.length > 0;
};

export { registerUser, loginUser, refreshUserToken, logoutUser, hasActiveSession };
