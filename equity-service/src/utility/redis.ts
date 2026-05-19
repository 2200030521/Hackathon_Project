// In-memory token store (temporary replacement for Redis)
interface TokenStore {
    [key: string]: { value: string; expiry: number };
}

const tokenStore: TokenStore = {};

// Cleanup expired tokens periodically
setInterval(() => {
    const now = Date.now();
    Object.keys(tokenStore).forEach(key => {
        if (tokenStore[key].expiry < now) {
            delete tokenStore[key];
        }
    });
}, 60000); // Cleanup every minute

const mockRedisClient = {
    async setEx(key: string, seconds: number, value: string) {
        tokenStore[key] = {
            value,
            expiry: Date.now() + seconds * 1000
        };
    },
    async get(key: string) {
        const token = tokenStore[key];
        if (!token) return null;
        if (token.expiry < Date.now()) {
            delete tokenStore[key];
            return null;
        }
        return token.value;
    },
    async del(key: string) {
        delete tokenStore[key];
        return 1;
    }
};

console.log('Using in-memory token storage');

export default mockRedisClient;
