"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";

export default function HoldingsSummaryPage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const { data, error, loading } = useApiData(
    () =>
      apiGet<ApiResponse<Record<string, unknown>>>(
        `/holdings/${investorId}/summary`
      ),
    [investorId]
  );

  const summary = data?.data;

  return (
    <>
      <PageHeader
        title="Portfolio Summary"
        description={`Consolidated equity summary for ${investorId}`}
      />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Total value", summary.total_portfolio_value],
              ["Invested", summary.invested_value],
              ["Gain / Loss", summary.total_gain_loss],
              ["Holdings", summary.holding_count],
            ] as [string, unknown][]
          ).map(([label, value]) => (
            <Card key={String(label)}>
              <p className="text-xs font-medium uppercase text-zinc-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">
                {value != null ? String(value) : "—"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
