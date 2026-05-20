import { Response } from 'express';
import { getTransactionsByInvestor, getTransactionCount } from '../models/transactionModel';
import { getTransactionsByInvestor as getAllTransactions } from '../models/transactionModel';
import { AuthRequest } from '../middleware/authMiddleware';

const getAuditLogs = async (req: AuthRequest, res: Response) => {
    try {
        // Only admin can view audit logs
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Only admin can view audit logs' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const investorId = req.query.investorId as string;

        // For now, return transactions as audit logs
        // In production, this would come from a dedicated audit_logs table
        let logs: any[] = [];
        let total = 0;

        if (investorId) {
            logs = await getTransactionsByInvestor(investorId, limit, (page - 1) * limit);
            total = await getTransactionCount(investorId);
        } else {
            // Get all transactions from all investors (simplified - in production use aggregated query)
            // This is a placeholder - you'd want to add a getAllTransactions method
            logs = [];
            total = 0;
        }

        const auditLogs = logs.map((log: any) => ({
            id: log.id,
            investor_id: log.investor_id,
            action: log.transaction_type,
            resource_type: 'TRANSACTION',
            resource_id: log.stock_symbol,
            changes: {
                quantity: log.quantity,
                price: log.price,
                total: Number(log.quantity) * Number(log.price),
                exchange: log.exchange,
            },
            created_at: log.executed_at,
        }));

        const pages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: { logs: auditLogs, pagination: { page, limit, total, pages } },
            message: 'Audit logs retrieved',
        });
    } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export { getAuditLogs };
