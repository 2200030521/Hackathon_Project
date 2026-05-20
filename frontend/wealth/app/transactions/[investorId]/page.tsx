"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function TransactionHistoryPage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const { data, error, loading } = useApiData(
    () =>
      apiGet<ApiResponse<{ transactions?: Record<string, unknown>[] }>>(
        `/transactions/${investorId}`
      ),
    [investorId]
  );

  const txs = data?.data?.transactions ?? (Array.isArray(data?.data) ? data.data : []);
  const rows = (txs as Record<string, unknown>[]).map((t) =>
    tableRow(
      t.stock_symbol ?? t.symbol,
      t.transaction_type ?? t.type,
      t.quantity,
      t.price,
      t.executed_at ?? t.transaction_date
    )
  );

  return (
    <>
      <PageHeader title="Transaction History" description={`Investor ${investorId}`} />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <DataTable columns={["Symbol", "Type", "Qty", "Price", "Date"]} rows={rows} />
        </Card>
      )}
    </>
  );
}
