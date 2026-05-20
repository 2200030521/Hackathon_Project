"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";

interface AuditLog {
  id: number;
  investor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, any>;
  created_at: string;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    investorId: "",
    resourceType: "",
    action: "",
  });

  const fetchLogs = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "50",
        ...(filters.investorId && { investorId: filters.investorId }),
        ...(filters.resourceType && { resourceType: filters.resourceType }),
        ...(filters.action && { action: filters.action }),
      });

      const res = await apiGet<ApiResponse<AuditLogsResponse>>(
        `/audit-logs?${params}`
      );

      if (res.data) {
        setLogs(res.data.logs || []);
        setTotalPages(res.data.pagination?.pages || 1);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN");
  };

  return (
    <>
      <PageHeader 
        title="Audit Logs" 
        description="View system audit logs and activities"
      />

      {/* Filters */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Investor ID
            </label>
            <input
              type="text"
              value={filters.investorId}
              onChange={(e) => setFilters({ ...filters, investorId: e.target.value })}
              placeholder="Filter by investor..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Resource Type
            </label>
            <select
              value={filters.resourceType}
              onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="TRANSACTION">Transaction</option>
              <option value="HOLDING">Holding</option>
              <option value="USER">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>
        </div>
      </Card>

      {loading && <LoadingState />}
      {error && <Alert message={error} />}

      {!loading && !error && (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Investor</th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Resource Type</th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Resource ID</th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-600">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={log.id} className={idx % 2 === 0 ? "bg-zinc-50" : ""}>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3 text-zinc-900">{log.investor_id}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{log.resource_type}</td>
                      <td className="px-4 py-3 text-zinc-700 font-mono text-xs">{log.resource_id}</td>
                      <td className="px-4 py-3 text-zinc-600 text-xs">
                        <details>
                          <summary className="cursor-pointer text-blue-600 hover:underline">
                            View
                          </summary>
                          <pre className="mt-2 bg-zinc-50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logs.length === 0 && (
              <div className="p-6 text-center text-zinc-500">
                No audit logs found
              </div>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => fetchLogs(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-zinc-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchLogs(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
