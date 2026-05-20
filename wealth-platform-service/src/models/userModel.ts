import pool from '../utility/pgManager';

const findByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM platform_users WHERE email = $1', [email]);
    return rows[0] || null;
};

const findById = async (id) => {
    const { rows } = await pool.query('SELECT id, full_name, email, role, created_at FROM platform_users WHERE id = $1', [id]);
    return rows[0] || null;
};

const createUser = async ({ full_name, email, password_hash, role }) => {
    const { rows } = await pool.query(
        'INSERT INTO platform_users (full_name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, full_name, email, role, created_at',
        [full_name, email, password_hash, role]
    );
    return rows[0];
};

const countAdmins = async () => {
    const { rows } = await pool.query("SELECT COUNT(*) FROM platform_users WHERE role = 'ADMIN'");
    return parseInt(rows[0].count);
};

export { findByEmail, findById, createUser, countAdmins };
