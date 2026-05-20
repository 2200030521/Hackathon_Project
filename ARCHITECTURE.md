# Unified Wealth Intelligence Platform - Complete Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Frontend Layer](#frontend-layer)
4. [Backend Services](#backend-services)
5. [Data Layer](#data-layer)
6. [Authentication & Security](#authentication--security)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Data Models](#data-models)
9. [User Flow Diagrams](#user-flow-diagrams)
10. [Setup & Running](#setup--running)

---

## 🏗️ System Overview

**Unified Wealth Intelligence Platform** is a modern microservices-based financial wealth management application built with Next.js frontend and three independent backend services (Equity, MF, Wealth Platform).

### Key Technologies
- **Frontend**: Next.js 16.2.6 with React 18, Tailwind CSS, React Context API
- **Backend**: Node.js + Express + TypeScript
- **Databases**: PostgreSQL (3 separate instances)
- **Caching**: Redis for sessions and token validation
- **Authentication**: JWT + API Keys + RBAC
- **Architecture**: Microservices with API Gateway pattern

---

## 🎯 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🖥️ FRONTEND LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js App (wealth-frontend/wealth) - Port 3001                   │
│  ├─ React Context API Authentication                                │
│  ├─ 10 Pages (Login, Register, Dashboard, Holdings, etc.)          │
│  └─ Tailwind CSS Styling                                            │
└─────────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────────┐
│              🔧 BACKEND SERVICES LAYER (Microservices)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Equity Service       │  │ MF Service       │  │ Wealth       │ │
│  │ Port 4001            │  │ Port 4002        │  │ Platform     │ │
│  ├──────────────────────┤  ├──────────────────┤  │ Port 3000    │ │
│  │ • Auth               │  │ • Funds          │  ├──────────────┤ │
│  │ • Holdings           │  │ • SIPs           │  │ • Dashboard  │ │
│  │ • Transactions       │  │ • Transactions   │  │ • Portfolio  │ │
│  │ • Watchlist          │  │ • NAV Data       │  │ • Health     │ │
│  │ • Market Data        │  │ • Scheme Info    │  │ • Proxy Layer│ │
│  │ • Investor Profile   │  │                  │  │              │ │
│  │                      │  │ Auth: API Key    │  │ Auth: JWT    │ │
│  │ Auth: JWT Bearer     │  │                  │  │ RBAC Roles   │ │
│  └──────────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────────┐
│                    💾 DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL Equity DB  │  PostgreSQL MF DB  │  PostgreSQL Wealth DB │
│  └─ Users             │  └─ Funds          │  └─ Dashboard Data   │
│  └─ Holdings          │  └─ SIPs           │  └─ Portfolio Stats  │
│  └─ Transactions      │  └─ Transactions   │  └─ Health Info      │
│  └─ Watchlist         │  └─ Customers      │                       │
│  └─ Market Data       │  └─ Schemes        │                       │
│                                                                      │
│  Redis Cache (Sessions, Tokens, Auth Validation)                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Frontend Layer

### Technology Stack
- **Framework**: Next.js 16.2.6 (App Router, not Pages router)
- **UI Framework**: Tailwind CSS with custom gradient backgrounds
- **State Management**: React Context API
- **HTTP Client**: Fetch API (browser native)
- **Type System**: Pure JavaScript (no TypeScript)
- **Styling**: Card-based layouts with Tailwind utilities

### Project Structure
```
wealth-frontend/wealth/
├── app/
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication state & token management
│   ├── layout.js                    # Root layout with AuthProvider
│   ├── page.js                      # Home page (redirects based on auth)
│   ├── login/
│   │   └── page.jsx                 # User login page
│   ├── register/
│   │   └── page.jsx                 # New user registration
│   ├── dashboard/
│   │   └── page.jsx                 # Main dashboard with portfolio overview
│   ├── profile/
│   │   └── page.jsx                 # View/edit investor profile
│   ├── holdings/
│   │   └── [investorId]/page.jsx    # Stock holdings display
│   ├── transactions/
│   │   └── [investorId]/page.jsx    # Buy/Sell transactions & history
│   ├── watchlist/
│   │   └── [investorId]/page.jsx    # Manage watched stocks
│   ├── market/
│   │   └── page.jsx                 # Browse & search market data
│   ├── portfolio/
│   │   └── [investorId]/page.jsx    # Portfolio analysis & allocation
│   ├── mutual-funds/
│   │   └── page.jsx                 # MF investments & SIP management
│   └── health/
│       └── page.jsx                 # Service health monitoring
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

### Authentication Flow in Frontend

```
User visits app
    ↓
AuthProvider loads token from localStorage
    ↓
Is token present?
    ├─ YES: Set authenticated state
    │   └─ Render authenticated pages
    └─ NO: Redirect to login
            └─ User enters credentials
                ↓
            Frontend calls POST /auth/login
                ↓
            Backend returns token + userId
                ↓
            Frontend stores in localStorage & context
                ↓
            Redirect to dashboard
```

### Key Components

#### AuthContext.jsx
- **Purpose**: Centralized authentication state management
- **Key Functions**:
  - `login(email, password)` - Authenticate user
  - `register(data)` - Create new account
  - `logout()` - Clear authentication
  - `setToken(token)` - Update token in state & storage
- **Storage**: localStorage for persistence across sessions
- **Export**: `useAuth()` hook for use in components

#### Page Components
Each page follows this pattern:
1. Check if loading is complete
2. Check if user has token
3. Redirect to login if not authenticated
4. Fetch data from API with Bearer token
5. Display data or loading/error state

---

## ⚙️ Backend Services

### 1. Equity Service (Port 4001)

**Responsibilities**: User authentication, stock holdings, transactions, watchlist, market data, investor profiles

#### Controllers & Routes
```typescript
// Authentication
POST   /api/auth/register          - Register new investor
POST   /api/auth/login             - Authenticate user (returns JWT)
POST   /api/auth/refresh           - Refresh token
POST   /api/auth/logout            - Logout user

// Investor Profile
GET    /api/investors/             - Get all investors
GET    /api/investors/:id          - Get investor profile
PUT    /api/investors/:id          - Update investor profile

// Holdings
GET    /api/holdings/:id           - Get investor holdings
GET    /api/holdings/:id/summary   - Get holdings summary

// Transactions
GET    /api/transactions/:id       - Get transaction history
POST   /api/transactions/buy       - Execute buy transaction
POST   /api/transactions/sell      - Execute sell transaction

// Watchlist
GET    /api/watchlist/:id          - Get watchlist
POST   /api/watchlist/:id          - Add to watchlist
DELETE /api/watchlist/:id          - Remove from watchlist

// Market Data
GET    /api/market/prices          - Get all stock prices
GET    /api/market/prices/:symbol  - Get specific stock price
POST   /api/market/prices          - Update prices (admin)
```

#### Middleware
- **authMiddleware**: JWT token validation
- **errorMiddleware**: Error handling & formatting
- **loggerMiddleware**: Request/response logging
- **rateLimitMiddleware**: Rate limiting protection
- **telemetry**: OpenTelemetry tracing
- **traceIdMiddleware**: Trace ID generation

#### Database (PostgreSQL)
```
Tables:
- investors (id, name, email, password_hash, phone, address, etc.)
- holdings (id, investor_id, symbol, quantity, avg_price, current_price)
- transactions (id, investor_id, symbol, type, quantity, price, date)
- watchlist (id, investor_id, symbol, added_date)
- market_data (id, symbol, price, change_percent, last_updated)
```

---

### 2. MF Service (Port 4002)

**Responsibilities**: Mutual fund investments, SIPs, fund data, NAV information

#### Controllers & Routes
```typescript
// Funds
GET    /api/funds/:customerRef     - Get customer funds
GET    /api/sips/:customerRef      - Get active SIPs

// Transactions
GET    /api/transactions/:customerRef - Get transaction history
POST   /api/transaction            - Create transaction

// SIPs
POST   /api/sip                    - Create new SIP
PATCH  /api/sip/:id/stop           - Stop active SIP

// NAV
GET    /api/nav/:schemeCode        - Get scheme NAV

// Customer
GET    /api/customer/:customerRef  - Get customer profile
```

#### Authentication
- **Type**: API Key based
- **Header**: `x-api-key: MF_SECRET_KEY`
- **Middleware**: `apiKeyMiddleware` - validates requests

#### Database (PostgreSQL)
```
Tables:
- customers (id, ref, name, email, phone, etc.)
- schemes (id, code, name, nav, category, performance)
- funds (id, customer_id, scheme_id, units, value, purchase_date)
- sips (id, customer_id, scheme_id, amount, frequency, start_date, end_date)
- transactions (id, customer_id, scheme_id, type, units, nav, amount, date)
```

---

### 3. Wealth Platform Service (Port 3000)

**Responsibilities**: Portfolio aggregation, dashboard, health monitoring, API proxying

#### Controllers & Routes
```typescript
// Dashboard
GET    /api/dashboard              - Get dashboard statistics

// Portfolio
GET    /api/portfolio/:investorId  - Get portfolio analysis

// Health
GET    /api/health                 - Check service health
GET    /api/serviceHealth          - Extended health info

// Proxies to Equity Service
/api/auth/*           → Equity Service
/api/investors/*      → Equity Service
/api/holdings/*       → Equity Service
/api/transactions/*   → Equity Service
/api/watchlist/*      → Equity Service
/api/market/*         → Equity Service

// Proxies to MF Service
/api/funds/*          → MF Service
/api/sips/*           → MF Service
/api/customer/*       → MF Service
/api/nav/*            → MF Service
/api/transaction/*    → MF Service
```

#### Middleware
- **authMiddleware**: JWT validation
- **rbacMiddleware**: Role-Based Access Control
- **errorMiddleware**: Error handling
- **rateLimitMiddleware**: Rate limiting

#### Database (PostgreSQL)
```
Tables:
- users (id, name, email, password_hash, role, created_at)
- dashboard_stats (id, user_id, portfolio_value, total_holdings, change_percent)
- portfolio_analytics (id, user_id, equity_percent, mf_percent, cash_percent)
```

---

## 💾 Data Layer

### PostgreSQL Instances
- **Equity DB**: User data, holdings, transactions, watchlist, market data
- **MF DB**: Customer data, schemes, funds, SIPs, transactions
- **Wealth DB**: Dashboard stats, portfolio analytics, user profiles

### Redis Cache
- **Sessions**: Store user sessions after login
- **Token Validation**: Cache JWT validation results
- **Frequently Accessed Data**: Market prices, scheme NAVs, dashboard stats

### Connection Management
```javascript
// PostgreSQL Connection Pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,  // Max clients
  min: 5,   // Min clients
  timeout: 30000
})

// Redis Connection
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
})
```

---

## 🔐 Authentication & Security

### JWT (JSON Web Tokens)
- **Used By**: Equity Service, Wealth Platform Service
- **Header**: `Authorization: Bearer <token>`
- **Payload**: 
  ```json
  {
    "userId": "12345",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  }
  ```
- **Validation**: Via Redis cache on each request

### API Key Authentication
- **Used By**: MF Service
- **Header**: `x-api-key: MF_SECRET_KEY`
- **Purpose**: Service-to-service authentication

### RBAC (Role-Based Access Control)
- **Roles**: ADMIN, INVESTOR, CUSTOMER
- **Implemented**: Wealth Platform Service
- **Middleware**: `rbacMiddleware(...allowedRoles)`
- **Usage**:
  ```javascript
  router.get('/', authMiddleware, rbacMiddleware('ADMIN'), handler)
  ```

### Security Features
✅ **Bcrypt Password Hashing** - Secure password storage
✅ **Helmet.js** - HTTP security headers
✅ **CORS** - Cross-origin protection
✅ **Rate Limiting** - DDoS protection
✅ **Input Validation** - Prevent injection attacks
✅ **Error Handling** - Don't expose sensitive info
✅ **HTTPS Ready** - Environment-based configuration

---

## 📡 API Endpoints Reference

### Equity Service (4001)

#### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login & get JWT |
| POST | `/api/auth/refresh` | JWT | Refresh token |
| POST | `/api/auth/logout` | JWT | Logout |

#### Investor
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/investors` | None | List all investors |
| GET | `/api/investors/:id` | JWT | Get profile |
| PUT | `/api/investors/:id` | JWT | Update profile |

#### Holdings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/holdings/:id` | JWT | Get holdings |
| GET | `/api/holdings/:id/summary` | JWT | Get summary |

#### Transactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/transactions/:id` | JWT | Get history |
| POST | `/api/transactions/buy` | JWT | Buy stock |
| POST | `/api/transactions/sell` | JWT | Sell stock |

#### Watchlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/watchlist/:id` | JWT | Get watchlist |
| POST | `/api/watchlist/:id` | JWT | Add stock |
| DELETE | `/api/watchlist/:id` | JWT | Remove stock |

#### Market Data
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/market/prices` | None | Get all prices |
| GET | `/api/market/prices/:symbol` | None | Get price |
| POST | `/api/market/prices` | JWT | Update prices |

---

### MF Service (4002)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/funds/:customerRef` | API Key | Get funds |
| GET | `/api/sips/:customerRef` | API Key | Get SIPs |
| POST | `/api/sip` | API Key | Create SIP |
| PATCH | `/api/sip/:id/stop` | API Key | Stop SIP |
| GET | `/api/transactions/:customerRef` | API Key | Get history |
| POST | `/api/transaction` | API Key | Create transaction |
| GET | `/api/nav/:schemeCode` | API Key | Get NAV |
| GET | `/api/customer/:customerRef` | API Key | Get profile |

---

### Wealth Platform (3000)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | JWT | Dashboard stats |
| GET | `/api/portfolio/:investorId` | JWT | Portfolio data |
| GET | `/api/health` | JWT | Health check |
| GET | `/api/serviceHealth` | None | Extended health |

---

## 📊 Data Models

### Investor Model
```javascript
{
  id: "uuid",
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "bcrypt_hash",
  phone: "+1-555-1234",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  investmentExperience: "intermediate",
  riskProfile: "moderate",
  createdAt: "2026-05-20T10:00:00Z",
  updatedAt: "2026-05-20T10:00:00Z"
}
```

### Holding Model
```javascript
{
  id: "uuid",
  investorId: "investor_uuid",
  symbol: "AAPL",
  quantity: 100,
  avgPrice: 150.25,
  currentPrice: 175.50,
  totalValue: 17550,
  gainLoss: 2525,
  gainLossPercent: 16.8,
  purchaseDate: "2026-01-15T00:00:00Z"
}
```

### Transaction Model
```javascript
{
  id: "uuid",
  investorId: "investor_uuid",
  symbol: "AAPL",
  type: "BUY", // BUY or SELL
  quantity: 50,
  price: 155.00,
  totalAmount: 7750,
  commission: 25,
  transactionDate: "2026-05-20T14:30:00Z",
  status: "COMPLETED" // PENDING, COMPLETED, FAILED
}
```

### Watchlist Model
```javascript
{
  id: "uuid",
  investorId: "investor_uuid",
  symbol: "AAPL",
  currentPrice: 175.50,
  addedDate: "2026-05-20T10:00:00Z",
  notes: "Good dividend stock"
}
```

### Mutual Fund Model
```javascript
{
  id: "uuid",
  customerId: "customer_uuid",
  schemeCode: "INF846K01D44",
  schemeName: "HDFC Growth Fund",
  category: "Growth",
  nav: 1250.50,
  units: 100.25,
  investmentAmount: 125550,
  currentValue: 125400.13,
  purchaseDate: "2026-03-15T00:00:00Z",
  aum: 500000000 // Assets Under Management
}
```

### SIP Model
```javascript
{
  id: "uuid",
  customerId: "customer_uuid",
  schemeCode: "INF846K01D44",
  amount: 5000,
  frequency: "MONTHLY", // MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY
  startDate: "2026-05-01T00:00:00Z",
  endDate: "2030-05-01T00:00:00Z",
  status: "ACTIVE", // ACTIVE, PAUSED, STOPPED
  investedAmount: 25000,
  currentValue: 27500,
  sipCount: 5
}
```

---

## 🔄 User Flow Diagrams

### Login & Dashboard Flow
```
User Opens App
  ↓
AuthContext loads token from localStorage
  ├─ Token found: Render authenticated UI
  └─ No token: Redirect to login
  
User enters email & password
  ↓
Frontend POST /auth/login (Equity Service)
  ↓
Backend validates credentials
  ↓
Generate JWT token
  ↓
Store in Redis + return to frontend
  ↓
Frontend stores token in localStorage + context
  ↓
router.push('/dashboard')
  ↓
Dashboard page loads
  ↓
Frontend GET /dashboard with Bearer token
  ↓
Backend validates token via Redis
  ↓
Fetch portfolio data from database
  ↓
Return dashboard stats
  ↓
Frontend renders dashboard ✅
```

### Transaction Flow
```
User opens Transactions page
  ↓
Frontend GET /transactions/:investorId
  ↓
Display transaction history
  ↓
User enters: symbol, quantity, price
  ↓
Click "Buy" button
  ↓
Frontend POST /transactions/buy
  {
    symbol: "AAPL",
    quantity: 50,
    price: 155.00,
    investorId: "user_id"
  }
  ↓
Backend validates:
  - User authenticated ✓
  - Symbol exists ✓
  - Sufficient balance ✓
  ↓
Create transaction record
  ↓
Update holdings (add or increase)
  ↓
Update market prices if needed
  ↓
Return success response
  ↓
Frontend refreshes transaction list
  ↓
Display confirmation message ✅
```

### Watchlist Management
```
User opens Watchlist page
  ↓
Frontend GET /watchlist/:investorId
  ↓
Display current watchlist items
  ↓
User enters stock symbol
  ↓
Click "Add to Watchlist"
  ↓
Frontend POST /watchlist/:investorId
  {
    symbol: "GOOGL"
  }
  ↓
Backend checks:
  - Symbol valid ✓
  - Not already in watchlist ✓
  ↓
Add to watchlist table
  ↓
Frontend refreshes watchlist
  ↓
Display updated list with new item ✅
  ↓
User can remove items:
  DELETE /watchlist/:itemId
  ↓
Update frontend list ✅
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+

### Environment Setup

#### Equity Service (.env)
```env
PORT=4001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=equity_db
DB_USER=equity_user
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10
```

#### MF Service (.env)
```env
PORT=4002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mf_db
DB_USER=mf_user
DB_PASSWORD=your_password
MF_API_KEY=MF_SECRET_KEY
```

#### Wealth Platform (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wealth_db
DB_USER=wealth_user
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
EQUITY_SERVICE_URL=http://localhost:4001
MF_SERVICE_URL=http://localhost:4002
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_EQUITY_URL=http://localhost:4001/api
NEXT_PUBLIC_MF_URL=http://localhost:4002/api
```

### Installation & Running

```bash
# Backend Services
cd equity-service
npm install
npm run dev

cd ../mf-service
npm install
npm run dev

cd ../wealth-platform-service
npm install
npm run dev

# Frontend
cd ../wealth-frontend/wealth
npm install
npm run dev

# Access the application
Frontend: http://localhost:3001
Equity Service: http://localhost:4001
MF Service: http://localhost:4002
Wealth Platform: http://localhost:3000
```

---

## 📝 Notes

### Key Design Decisions

1. **Microservices Architecture**: Separated concerns into three services
   - Independent scaling and deployment
   - Fault isolation
   - Technology flexibility

2. **API Gateway Pattern**: Wealth Platform routes to other services
   - Single entry point for client
   - Service discovery handled centrally
   - Cross-cutting concerns (RBAC, logging) applied once

3. **Separate Databases**: Each service has its own database
   - Data isolation and independence
   - Allows different schemas optimized per service
   - Enables service-specific optimization

4. **JWT + Redis**: Hybrid authentication approach
   - JWT for stateless validation
   - Redis for token revocation and session management

5. **React Context + localStorage**: Simple state management
   - No external dependencies required
   - Works well for small to medium apps
   - Easy to implement and debug

### Performance Considerations

- Redis caching for frequently accessed data
- Connection pooling for database queries
- Rate limiting to prevent abuse
- Lazy loading of components
- Efficient database indexing

### Security Best Practices

- All passwords hashed with bcrypt (10 rounds)
- HTTPS ready with environment-based configuration
- CORS properly configured
- Input validation on all endpoints
- Error messages don't leak sensitive information
- Rate limiting on all services

---

**Last Updated**: May 20, 2026
**Version**: 1.0
**Author**: Architecture Documentation Team
