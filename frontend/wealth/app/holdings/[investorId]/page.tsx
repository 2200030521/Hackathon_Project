"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function HoldingsPage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const { data, error, loading } = useApiData(
    () => apiGet<ApiResponse<Record<string, unknown>[]>>(`/holdings/${investorId}`),
    [investorId]
  );

  const holdings = Array.isArray(data?.data) ? data.data : [];
  const rows = holdings.map((h) =>
    tableRow(
      h.stock_symbol ?? h.symbol,
      h.quantity,
      h.avg_buy_price ?? h.average_cost,
      h.current_market_price ?? h.current_price,
      h.exchange
    )
  );

  return (
    <>
      <PageHeader title="My Holdings" description={`Investor ${investorId}`} />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <DataTable
            columns={["Symbol", "Qty", "Avg cost", "Current", "Exchange"]}
            rows={rows}
          />
        </Card>
      )}
    </>
  );
}
