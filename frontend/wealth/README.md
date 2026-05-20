# Wealth Platform Frontend

Next.js 16 app with **React Context** authentication and **cookie-based** JWT storage.

## Setup

```bash
cd frontend/wealth
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Ensure backend services are running:

- Wealth Platform API: `http://localhost:4000` (proxied via `/api/*`)
- MF Service: `http://localhost:4002` (proxied via `/api/mf/*` with server-side API key)

## Auth

- Tokens are stored in cookies: `wealth_access_token`, `wealth_refresh_token`, `wealth_user`
- `AuthProvider` exposes `login`, `register`, `logout`, and `refreshToken`
- Automatic token refresh on `401` responses via `lib/api.ts`
- Route protection in `middleware.ts`

## Folder structure

```
app/
├── auth/                 # Login, register, refresh
│   ├── login/
│   ├── register/
│   └── refresh/
├── dashboard/
├── health/
├── holdings/[investorId]/
├── portfolio/[investorId]/
├── transactions/
├── watchlist/[investorId]/
├── market/prices/
├── funds/[customerRef]/
├── sips/[customerRef]/
├── sip/
├── mf/transactions/
├── nav/[schemeCode]/
├── investors/[investorId]/
├── customer/[customerRef]/
└── api/mf/               # MF proxy (server)
```

## Routes

| Page | Path |
|------|------|
| Login | `/auth/login` |
| Register | `/auth/register` |
| Token refresh | `/auth/refresh` |
| Admin dashboard | `/dashboard` |
| Health monitoring | `/health` |
| My holdings | `/holdings/:investorId` |
| Portfolio summary | `/holdings/:investorId/summary` |
| Portfolio details | `/portfolio/:investorId` |
| Transaction history | `/transactions/:investorId` |
| Buy / Sell stock | `/transactions/buy`, `/transactions/sell` |
| Watchlist | `/watchlist/:investorId` |
| Market prices | `/market/prices`, `/market/prices/:symbol` |
| MF investments | `/funds/:customerRef` |
| SIP management | `/sips/:customerRef` |
| Create / Stop SIP | `/sip`, `/sip/:id/stop` |
| MF transactions | `/mf/transactions/:customerRef` |
| NAV info | `/nav/:schemeCode` |
| Investor profile | `/investors/:investorId` |
| MF customer profile | `/customer/:customerRef` |

MF transactions use `/mf/transactions/:customerRef` to avoid conflicting with equity `/transactions/:investorId`.

Set `wealth_customer_ref` in localStorage (or use the Create SIP form) for MF sidebar links.
