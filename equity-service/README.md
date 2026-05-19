# Equity Service TypeScript API Documentation

## Overview
The **Equity Service** is a comprehensive Node.js/Express TypeScript-based microservice providing APIs for managing investor portfolios, stock transactions, watchlists, and real-time market data with JWT authentication and role-based security.

**Service Name:** equity-service  
**Port:** 4001  
**Language:** TypeScript  
**Technology Stack:** Node.js, Express, PostgreSQL, Redis, JWT, bcrypt

---

## Project Structure

```
equity-service/
├── src/
│   ├── controllers/              # Business logic & services
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── holdingService.ts
│   │   ├── transactionService.ts
│   │   ├── watchlistService.ts
│   │   ├── marketService.ts
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── equityTransactionController.ts
│   │   ├── watchlistController.ts
│   │   └── marketController.ts
│   │
│   ├── models/                  # Data access & types
│   │   ├── types.ts
│   │   ├── UserRepository.ts
│   │   ├── HoldingRepository.ts
│   │   ├── TransactionRepository.ts
│   │   ├── WatchlistRepository.ts
│   │   └── MarketRepository.ts
│   │
│   ├── routes/                  # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── holdingsRoutes.ts
│   │   ├── portfolioRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   ├── watchlistRoutes.ts
│   │   └── marketRoutes.ts
│   │
│   ├── middleware/              # Express middleware
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   │
│   ├── utility/                 # Shared utilities
│   │   ├── pgManager.ts
│   │   ├── redisManager.ts
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   └── responseFormatter.ts
│   │
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── dist/                        # Compiled JavaScript
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── DATABASE_SCHEMA.sql          # Database schema
├── README.md                    # This file
└── .gitignore
```

---

## API Endpoints (18 Total)

### Authentication (4 endpoints)

#### 1. POST `/api/auth/login`
Authenticate investor and return JWT + refresh token

**Request:**
```json
{
    "email": "investor@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "uuid",
            "email": "investor@example.com",
            "name": "Investor Name"
        }
    }
}
```

#### 2. POST `/api/auth/register`
Register a new investor account

**Request:**
```json
{
    "email": "investor@example.com",
    "password": "password123",
    "name": "Investor Name",
    "phone": "+1234567890"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "id": "uuid",
        "email": "investor@example.com",
        "name": "Investor Name"
    }
}
```

#### 3. POST `/api/auth/refresh`
Generate new access token using refresh token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Token refreshed",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

#### 4. POST `/api/auth/logout`
Logout investor and invalidate refresh token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully",
    "data": {
        "message": "Logged out successfully"
    }
}
```

---

### Investor Profile (2 endpoints)

#### 5. GET `/api/investors/:investorId`
Fetch investor profile details

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "User profile retrieved",
    "data": {
        "id": "uuid",
        "email": "investor@example.com",
        "name": "Investor Name",
        "phone": "+1234567890",
        "address": "123 Main St",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
}
```

#### 6. PUT `/api/investors/:investorId`
Update investor profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
    "name": "Updated Name",
    "phone": "+9876543210",
    "address": "456 Oak Ave"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": "uuid",
        "email": "investor@example.com",
        "name": "Updated Name",
        "phone": "+9876543210",
        "address": "456 Oak Ave"
    }
}
```

---

### Holdings (2 endpoints)

#### 7. GET `/api/holdings/:investorId`
Fetch investor stock holdings

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Holdings retrieved",
    "data": [
        {
            "id": "uuid",
            "investor_id": "uuid",
            "symbol": "AAPL",
            "quantity": 100,
            "average_cost": 150.00,
            "current_price": 175.00,
            "total_value": 17500.00,
            "gain_loss": 2500.00,
            "gain_loss_percent": "16.67",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]
}
```

#### 8. GET `/api/holdings/:investorId/summary`
Fetch consolidated equity portfolio summary

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Portfolio summary retrieved",
    "data": {
        "total_portfolio_value": 35000.00,
        "invested_value": 30000.00,
        "total_gain_loss": 5000.00,
        "total_gain_loss_percent": "16.67",
        "holding_count": 2,
        "holdings": [...]
    }
}
```

---

### Transactions (3 endpoints)

#### 9. GET `/api/transactions/:investorId`
Fetch investor transaction history

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response (200):**
```json
{
    "success": true,
    "message": "Transactions retrieved",
    "data": {
        "transactions": [
            {
                "id": "uuid",
                "investor_id": "uuid",
                "symbol": "AAPL",
                "type": "BUY",
                "quantity": 10,
                "price": 150.00,
                "total_amount": 1500.00,
                "status": "COMPLETED",
                "transaction_date": "2024-01-01T00:00:00Z",
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 50,
            "total": 100,
            "pages": 2
        }
    }
}
```

#### 10. POST `/api/transactions/buy`
Create stock BUY transaction

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
    "symbol": "AAPL",
    "quantity": 10,
    "price": 150.00
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Stock purchased successfully",
    "data": {
        "id": "uuid",
        "investor_id": "uuid",
        "symbol": "AAPL",
        "type": "BUY",
        "quantity": 10,
        "price": 150.00,
        "total_amount": 1500.00,
        "status": "COMPLETED",
        "transaction_date": "2024-01-01T00:00:00Z"
    }
}
```

#### 11. POST `/api/transactions/sell`
Create stock SELL transaction

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
    "symbol": "AAPL",
    "quantity": 5,
    "price": 175.00
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Stock sold successfully",
    "data": {
        "id": "uuid",
        "investor_id": "uuid",
        "symbol": "AAPL",
        "type": "SELL",
        "quantity": 5,
        "price": 175.00,
        "total_amount": 875.00,
        "status": "COMPLETED",
        "transaction_date": "2024-01-01T00:00:00Z"
    }
}
```

---

### Watchlist (3 endpoints)

#### 12. GET `/api/watchlist/:investorId`
Fetch investor watchlist

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Watchlist retrieved",
    "data": [
        {
            "id": "uuid",
            "investor_id": "uuid",
            "symbol": "GOOGL",
            "price": 140.00,
            "day_high": 142.00,
            "day_low": 139.00,
            "added_at": "2024-01-01T00:00:00Z"
        }
    ]
}
```

#### 13. POST `/api/watchlist`
Add stock to watchlist

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
    "symbol": "GOOGL"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Stock added to watchlist",
    "data": {
        "id": "uuid",
        "investor_id": "uuid",
        "symbol": "GOOGL",
        "price": 140.00,
        "added_at": "2024-01-01T00:00:00Z"
    }
}
```

#### 14. DELETE `/api/watchlist/:id`
Remove stock from watchlist

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Stock removed from watchlist",
    "data": {
        "id": "uuid",
        "investor_id": "uuid",
        "symbol": "GOOGL",
        "added_at": "2024-01-01T00:00:00Z"
    }
}
```

---

### Market Prices (3 endpoints)

#### 15. GET `/api/market/prices`
Fetch all market prices

**Response (200):**
```json
{
    "success": true,
    "message": "Market prices retrieved",
    "data": [
        {
            "id": "uuid",
            "symbol": "AAPL",
            "current_price": 175.00,
            "previous_close": 170.00,
            "day_high": 176.00,
            "day_low": 174.00,
            "volume": 50000000,
            "market_cap": 2750000000000,
            "pe_ratio": 28.5,
            "change": 5.00,
            "change_percent": "2.94",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]
}
```

#### 16. GET `/api/market/prices/:symbol`
Fetch specific stock market price

**Response (200):**
```json
{
    "success": true,
    "message": "Market price retrieved",
    "data": {
        "id": "uuid",
        "symbol": "AAPL",
        "current_price": 175.00,
        "previous_close": 170.00,
        "day_high": 176.00,
        "day_low": 174.00,
        "volume": 50000000,
        "market_cap": 2750000000000,
        "pe_ratio": 28.5,
        "change": 5.00,
        "change_percent": "2.94",
        "updated_at": "2024-01-01T00:00:00Z"
    }
}
```

#### 17. POST `/api/market/prices`
Update market prices (Admin)

**Request:**
```json
{
    "prices": [
        {
            "symbol": "AAPL",
            "currentPrice": 175.50,
            "dayHigh": 176.50,
            "dayLow": 174.50,
            "volume": 50000000,
            "previousClose": 170.00,
            "marketCap": 2750000000000,
            "peRatio": 28.5
        }
    ]
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Market prices updated",
    "data": [...]
}
```

---

### Health Check (1 endpoint)

#### 18. GET `/health`
Service health check

**Response (200):**
```json
{
    "service": "equity-service",
    "status": "UP",
    "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Database Schema

### equity_users
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
name (VARCHAR)
phone (VARCHAR)
password_hash (VARCHAR)
address (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### equity_holdings
```sql
id (UUID, PK)
investor_id (UUID, FK → equity_users)
symbol (VARCHAR)
quantity (DECIMAL)
average_cost (DECIMAL)
current_price (DECIMAL)
total_value (DECIMAL)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### equity_transactions
```sql
id (UUID, PK)
investor_id (UUID, FK → equity_users)
symbol (VARCHAR)
type (VARCHAR: BUY, SELL)
quantity (DECIMAL)
price (DECIMAL)
total_amount (DECIMAL)
status (VARCHAR: PENDING, COMPLETED, FAILED, CANCELLED)
transaction_date (TIMESTAMP)
created_at (TIMESTAMP)
```

### equity_watchlist
```sql
id (UUID, PK)
investor_id (UUID, FK → equity_users)
symbol (VARCHAR)
added_at (TIMESTAMP)
```

### equity_market_prices
```sql
id (UUID, PK)
symbol (VARCHAR, UNIQUE)
current_price (DECIMAL)
previous_close (DECIMAL)
day_high (DECIMAL)
day_low (DECIMAL)
volume (BIGINT)
market_cap (DECIMAL)
pe_ratio (DECIMAL)
updated_at (TIMESTAMP)
```

### equity_refresh_tokens
```sql
id (UUID, PK)
investor_id (UUID, FK → equity_users)
token (TEXT)
expires_at (TIMESTAMP)
created_at (TIMESTAMP)
```

---

## Setup & Installation

### Prerequisites
- Node.js v16+ 
- PostgreSQL v12+
- Redis v5+
- TypeScript v5+

### Installation Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database:**
```bash
psql -U postgres -d wealth_platform_db -f DATABASE_SCHEMA.sql
```

4. **Compile TypeScript:**
```bash
npm run build
```

5. **Run development server:**
```bash
npm run dev
```

6. **Run production server:**
```bash
npm start
```

Server will run on `http://localhost:4001`

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

**Token Expiry:** 15 minutes (configurable)  
**Refresh Token Expiry:** 7 days (configurable)  
**Storage:** Refresh tokens stored in Redis

---

## Error Handling

Standard error response format:

```json
{
    "success": false,
    "message": "Error description",
    "errors": null
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Features

✅ **JWT Authentication** - Secure token-based auth with refresh tokens  
✅ **Password Hashing** - bcrypt password encryption  
✅ **Role-Based Access** - Token-based authorization  
✅ **Portfolio Management** - Track holdings with gain/loss calculations  
✅ **Transaction Processing** - Buy/sell with automatic status tracking  
✅ **Watchlist** - Create and manage stock watchlists  
✅ **Market Data** - Real-time stock prices and metrics  
✅ **Input Validation** - Comprehensive request validation  
✅ **Error Handling** - Centralized error middleware  
✅ **Logging** - Morgan request logging  
✅ **Security** - Helmet security headers, CORS support  
✅ **Caching** - Redis for token storage  
✅ **Type Safety** - Full TypeScript implementation  

---

## Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime |
| TypeScript | 5.3+ | Language |
| Express | 5.2+ | Web Framework |
| PostgreSQL | 12+ | Database |
| Redis | 5+ | Cache |
| JWT | 9.0+ | Authentication |
| bcrypt | 6.0+ | Password Hashing |
| Helmet | 8.1+ | Security |
| CORS | 2.8+ | Cross-Origin |
| Morgan | 1.10+ | Logging |

---

## API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User","phone":"+1234567890"}'

# Login
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get Holdings (with token)
curl -X GET http://localhost:4001/api/holdings/uuid \
  -H "Authorization: Bearer <access_token>"
```

---

## License

ISC

---

## Support

For issues, feature requests, or documentation updates, please contact the development team.
