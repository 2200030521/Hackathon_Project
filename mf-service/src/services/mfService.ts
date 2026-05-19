import { db } from "../config/db";

export const getCustomerFundsService = async (
    customerRef: string
) => {

    const query = `
        SELECT
            cf.*,
            s.scheme_name,
            s.amc_name,
            s.nav_value
        FROM mf_customer_funds cf
        JOIN mf_schemes s
        ON cf.scheme_code = s.scheme_code
        WHERE cf.customer_ref = $1
    `;

    const result = await db.query(
        query,
        [customerRef]
    );

    return result.rows;
};

export const getCustomerSipsService = async (
    customerRef: string
) => {

    const query = `
        SELECT *
        FROM mf_sips
        WHERE customer_ref = $1
    `;

    const result = await db.query(
        query,
        [customerRef]
    );

    return result.rows;
};

export const getTransactionsService = async (
    customerRef: string
) => {

    const query = `
        SELECT *
        FROM mf_transactions
        WHERE customer_ref = $1
    `;

    const result = await db.query(
        query,
        [customerRef]
    );

    return result.rows;
};

export const createSipService = async (
    body: any
) => {

    const query = `
        INSERT INTO mf_sips (
            customer_ref,
            scheme_code,
            sip_amount,
            sip_status,
            start_date,
            next_due_date
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
    `;

    const values = [
        body.customer_ref,
        body.scheme_code,
        body.sip_amount,
        body.sip_status,
        body.start_date,
        body.next_due_date
    ];

    const result = await db.query(
        query,
        values
    );

    return result.rows[0];
};

export const getNavService = async (
    schemeCode:string
)=>{

    const query = `
        SELECT
            scheme_code,
            scheme_name,
            nav_value
        FROM mf_schemes
        WHERE scheme_code = $1
    `;

    const result = await db.query(
        query,
        [schemeCode]
    );

    return result.rows[0];
};

export const stopSipService = async (
    id:string
)=>{

    const query = `
        UPDATE mf_sips
        SET sip_status='STOPPED'
        WHERE id=$1
        RETURNING *
    `;

    const result = await db.query(
        query,
        [id]
    );

    return result.rows[0];
};

export const createTransactionService = async (
    body:any
)=>{

    const query = `
        INSERT INTO mf_transactions (
            customer_ref,
            scheme_code,
            transaction_type,
            amount,
            units,
            executed_at
        )
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING *
    `;

    const values = [
        body.customer_ref,
        body.scheme_code,
        body.transaction_type,
        body.amount,
        body.units
    ];

    const result = await db.query(
        query,
        values
    );

    return result.rows[0];
};

export const getCustomerProfileService = async (
    customerRef:string
)=>{

    const query = `
        SELECT *
        FROM mf_customers
        WHERE customer_ref = $1
    `;

    const result = await db.query(
        query,
        [customerRef]
    );

    return result.rows[0];
};