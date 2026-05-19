export interface Transaction {
    id?: number;
    customer_ref: string;
    scheme_code: string;
    transaction_type: string;
    amount: number;
    units: number;
}