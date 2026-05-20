"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";

export default function StockPriceDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);
  const { data, error, loading } = useApiData(
    () => apiGet<ApiResponse<Record<string, unknown>>>(`/market/prices/${symbol}`),
    [symbol]
  );

  return (
    <>
      <PageHeader title={symbol} description="Stock price details" />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {data?.data && (
        <Card>
          <pre className="overflow-auto text-xs text-zinc-700">
            {JSON.stringify(data.data, null, 2)}
          </pre>
        </Card>
      )}
    </>
  );
}
