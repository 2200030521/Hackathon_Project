import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
.then(() => {
    console.log('Database connected successfully');
})
.catch((error) => {
    console.error('Database connection failed:', error.message);
    console.error('Full error:', error);
});

export const query = (text: string, params?: any[]) => client.query(text, params);
export default client;
