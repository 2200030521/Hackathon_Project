import redisClient from '../utility/redisClient';

const EQUITY_URL = process.env.EQUITY_SERVICE_URL || 'http://localhost:4001';
const MF_URL     = process.env.MF_SERVICE_URL     || 'http://localhost:4002';

export const checkHealth = async () => {
    // Check Redis connection
    let redisStatus = 'DOWN';
    try {
        if (redisClient.isReady) {
            await redisClient.ping();
            redisStatus = 'UP';
        }
    } catch (err: any) {
        redisStatus = `DOWN: ${err.message}`;
    }

    const [eq, mf] = await Promise.allSettled([
        fetch(`${EQUITY_URL}/health`).then(r => r.json()),
        fetch(`${MF_URL}/health`).then(r => r.json())
    ]);

    return {
        platform:       { status: 'UP', timestamp: new Date(), redis: redisStatus },
        equity_service: eq.status === 'fulfilled' ? { status: 'UP', ...eq.value } : { status: 'DOWN', error: eq.reason?.message },
        mf_service:     mf.status === 'fulfilled' ? { status: 'UP', ...mf.value } : { status: 'DOWN', error: mf.reason?.message }
    };
};
