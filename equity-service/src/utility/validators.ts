export const STOCK_SYMBOL_REGEX = /^[A-Z0-9.&-]{1,20}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const isValidStockSymbol = (symbol: string): boolean =>
    STOCK_SYMBOL_REGEX.test(symbol);

export const isValidPan = (pan: string): boolean =>
    PAN_REGEX.test(pan.toUpperCase());
