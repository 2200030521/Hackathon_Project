"use client";

import { FormEvent, useState, use } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Button, Card, Input, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function WatchlistPage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const [symbol, setSymbol] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, error, loading, reload } = useApiData(
    () => apiGet<ApiResponse<Record<string, unknown>[]>>(`/watchlist/${investorId}`),
    [investorId]
  );

  const items = Array.isArray(data?.data) ? data.data : [];

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    setActionError(null);
    try {
      await apiPost(`/watchlist/${investorId}`, { symbol });
      setSymbol("");
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to add");
    }
  }

  async function onRemove(id: string) {
    setActionError(null);
    try {
      await apiDelete(`/watchlist/${id}`);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to remove");
    }
  }

  const rows = items.map((w) => ({
    id: String(w.id ?? ""),
    cells: tableRow(w.stock_symbol ?? w.symbol, w.current_price ?? w.price, w.added_at),
  }));

  return (
    <>
      <PageHeader title="Watchlist" description={`Stocks tracked for ${investorId}`} />
      <Card className="mb-6 max-w-md">
        <form onSubmit={onAdd} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Input label="Add symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
          </div>
          <Button type="submit">Add</Button>
        </form>
        {actionError && <div className="mt-3"><Alert message={actionError} /></div>}
      </Card>
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-zinc-500">
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Added</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100">
                  <td className="px-3 py-2">{row.cells[0]}</td>
                  <td className="px-3 py-2">{row.cells[1]}</td>
                  <td className="px-3 py-2">{row.cells[2]}</td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" type="button" onClick={() => onRemove(row.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <p className="py-8 text-center text-sm text-zinc-500">Watchlist is empty.</p>}
        </Card>
      )}
    </>
  );
}
