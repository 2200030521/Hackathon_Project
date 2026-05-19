export interface IEquityUser {
    investor_id: string;
    full_name: string;
    email: string;
    pan_number: string;
    demat_account: string;
    password_hash?: string;
    created_at: Date;
}

export interface IEquityHolding {
    id: number;
    investor_id: string;
    stock_symbol: string;
    quantity: number;
    avg_buy_price: number;
    current_market_price: number;
    exchange: string;
    updated_at: Date;
}

export interface IEquityTransaction {
    id: number;
    investor_id: string;
    stock_symbol: string;
    transaction_type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    exchange: string;
    realized_gain?: number | null;
    executed_at: Date;
}

export interface IEquityWatchlist {
    id: number;
    investor_id: string;
    stock_symbol: string;
    added_at: Date;
}

export interface IMarketPrice {
    stock_symbol: string;
    company_name: string;
    current_price: number;
    day_change_percent: number;
    exchange: string;
    updated_at: Date;
}

export interface IRefreshToken {
    id: number;
    investor_id: string;
    token: string;
    expires_at: Date;
    created_at: Date;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export interface JWTPayload {
    id: string;
    email: string;
}
