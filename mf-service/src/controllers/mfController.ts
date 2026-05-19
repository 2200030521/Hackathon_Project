import { Request, Response } from "express";

import {
    getCustomerFundsService,
    getCustomerSipsService,
    getTransactionsService,
    createSipService,
    getNavService,
    stopSipService,
    createTransactionService,
    getCustomerProfileService
} from "../services/mfService";

export const getCustomerFunds = async (
    req: Request,
    res: Response
) => {

    try {

        const customerRef =
            req.params.customerRef as string;

        const data =
            await getCustomerFundsService(
                customerRef
            );

        res.json({
            success: true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getCustomerSips = async (
    req: Request,
    res: Response
) => {

    try {

        const customerRef =
            req.params.customerRef as string;

        const data =
            await getCustomerSipsService(
                customerRef
            );

        res.json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getTransactions = async (
    req: Request,
    res: Response
) => {

    try {

        const customerRef =
            req.params.customerRef as string;

        const data =
            await getTransactionsService(
                customerRef
            );

        res.json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const createSip = async (
    req: Request,
    res: Response
) => {

    try {

        const data =
            await createSipService(
                req.body
            );

        res.status(201).json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getNav = async (
    req: Request,
    res: Response
) => {

    try {

        const schemeCode =
            req.params.schemeCode as string;

        const data =
            await getNavService(
                schemeCode
            );

        res.json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const stopSip = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            req.params.id as string;

        const data =
            await stopSipService(id);

        res.json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const createTransaction = async (
    req: Request,
    res: Response
) => {

    try {

        const data =
            await createTransactionService(
                req.body
            );

        res.status(201).json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getCustomerProfile = async (
    req: Request,
    res: Response
)=>{

    try {

        const customerRef =
            req.params.customerRef as string;

        const data =
            await getCustomerProfileService(
                customerRef
            );

        res.json({
            success:true,
            data
        });

    } catch(error:any){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};