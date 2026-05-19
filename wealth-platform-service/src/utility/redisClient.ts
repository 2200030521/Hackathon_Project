import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

redisClient.connect().catch((err) => {
    console.error('Redis failed to connect:', err.message);
});

export default redisClient;
