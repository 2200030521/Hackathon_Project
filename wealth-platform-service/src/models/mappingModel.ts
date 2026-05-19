import pool from '../utility/pgManager';

const getMfRefByEquityId = async (equity_investor_id) => {
    const { rows } = await pool.query(
        'SELECT mf_customer_ref FROM investor_identity_mappings WHERE equity_investor_id = $1',
        [equity_investor_id]
    );
    return rows[0]?.mf_customer_ref || null;
};

const getAllMappings = async () => {
    const { rows } = await pool.query('SELECT * FROM investor_identity_mappings');
    return rows;
};

export { getMfRefByEquityId, getAllMappings };
