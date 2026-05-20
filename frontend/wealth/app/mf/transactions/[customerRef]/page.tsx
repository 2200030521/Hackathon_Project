"use client";

import { use } from "react";
import { mfGet } from "@/lib/mfApi";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function MfTransactionsPage({
  params,
}: {
  params: Promise<{ customerRef: string }>;
}) {
  const { customerRef } = use(params);
  const { data, error, loading } = useApiData(
    () => mfGet<ApiResponse<unknown>>(`/transactions/${customerRef}`),
    [customerRef]
  );

  const txs = Array.isArray(data?.data) ? data.data : [];
  const rows = (txs as Record<string, unknown>[]).map((t) =>
    tableRow(t.id, t.scheme_code, t.type ?? t.transaction_type, t.amount, t.date ?? t.created_at)
  );

  return (
    <>
      <PageHeader title="MF Transactions" description={`Customer ${customerRef}`} />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <DataTable columns={["ID", "Scheme", "Type", "Amount", "Date"]} rows={rows} />
        </Card>
      )}
    </>
  );
}
