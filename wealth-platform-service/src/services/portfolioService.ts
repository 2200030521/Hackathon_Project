import { getMfRefByEquityId } from '../models/mappingModel';

const EQUITY_URL = process.env.EQUITY_SERVICE_URL || 'http://localhost:4001';
const MF_URL     = process.env.MF_SERVICE_URL     || 'http://localhost:4002';
const SVC_KEY    = process.env.INTERNAL_SERVICE_KEY || 'INTERNAL_WEALTH_PLATFORM_KEY';
const MF_KEY     = process.env.MF_API_KEY           || 'MF_SECRET_KEY';

const fetchEquity = async (path) => {
    const res  = await fetch(`${EQUITY_URL}${path}`, { headers: { 'x-service-key': SVC_KEY } });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || `Equity error ${res.status}`);
    return body.data;
};

const fetchMF = async (path) => {
    const res  = await fetch(`${MF_URL}${path}`, { headers: { 'x-api-key': MF_KEY } });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || `MF error ${res.status}`);
    return body.data;
};

import redisClient from '../utility/redisClient';

const getPortfolio = async (investorId) => {
    // 1. Check Redis Cache
    const cacheKey = `portfolio:${investorId}`;
    try {
        if (redisClient.isReady) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
    } catch (err) {
        console.error('Redis read error:', err.message);
    }

    // 2. Fetch fresh data
    const mfRef = await getMfRefByEquityId(investorId);

    const [equityResult, mfFundsResult, mfSipsResult] = await Promise.allSettled([
        fetchEquity(`/api/holdings/${investorId}/summary`),
        mfRef ? fetchMF(`/api/funds/${mfRef}`) : Promise.reject(new Error('No MF account linked')),
        mfRef ? fetchMF(`/api/sips/${mfRef}`)  : Promise.reject(new Error('No MF account linked'))
    ]);

    const warnings = [];

    const equity = equityResult.status === 'fulfilled' ? equityResult.value : null;
    if (equityResult.status === 'rejected') warnings.push(`Equity: ${equityResult.reason?.message}`);

    const mfFunds = mfFundsResult.status === 'fulfilled' ? mfFundsResult.value : null;
    if (mfFundsResult.status === 'rejected') warnings.push(mfRef ? `MF: ${mfFundsResult.reason?.message}` : 'No MF account linked');

    const mfSips = mfSipsResult.status === 'fulfilled' ? mfSipsResult.value : null;

    const equityValue = parseFloat(equity?.total_portfolio_value || 0);
    const mfValue = Array.isArray(mfFunds)
        ? mfFunds.reduce((s, f) => s + parseFloat(f.current_value || 0), 0)
        : 0;

    const responseData = {
        investor_id:     investorId,
        mf_customer_ref: mfRef || null,
        equity,
        mutualFunds: { funds: mfFunds, sips: mfSips },
        summary: {
            equity_value:    equityValue,
            mf_value:        mfValue,
            total_net_worth: equityValue + mfValue
        },
        ...(warnings.length > 0 && { warnings })
    };

    // 3. Save to Redis Cache (expires in 60 seconds)
    try {
        if (redisClient.isReady) {
            await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 60 });
        }
    } catch (err) {
        console.error('Redis write error:', err.message);
    }

    return responseData;
};

export { getPortfolio };
