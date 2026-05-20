import pool from '../utility/pgManager';

const getDashboardStats = async () => {
    const [investorsResult, mappingsResult] = await Promise.allSettled([
        pool.query('SELECT COUNT(*) FROM investor_identity_mappings'),
        pool.query('SELECT COUNT(*) FROM investor_identity_mappings WHERE mf_customer_ref IS NOT NULL')
    ]);

    const totalInvestors = investorsResult.status === 'fulfilled'
        ? parseInt(investorsResult.value.rows[0].count) : 0;

    const linkedMF = mappingsResult.status === 'fulfilled'
        ? parseInt(mappingsResult.value.rows[0].count) : 0;

    return {
        total_investors:  totalInvestors,
        mf_linked:        linkedMF,
        equity_only:      totalInvestors - linkedMF,
        operational_status: 'HEALTHY'
    };
};

export { getDashboardStats };
