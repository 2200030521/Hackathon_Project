"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function MfInvestmentsPage({
  params,
}: {
  params: Promise<{ customerRef: string }>;
}) {
  const { customerRef } = use(params);
  const { data, error, loading } = useApiData(
    () => apiGet<ApiResponse<unknown>>(`/funds/${customerRef}`),
    [customerRef]
  );

  const funds = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : [];
  const rows = (funds as Record<string, unknown>[]).map((f) =>
    tableRow(f.scheme_code ?? f.schemeCode, f.scheme_name ?? f.name, f.units, f.current_value ?? f.value)
  );

  return (
    <>
      <PageHeader title="MF Investments" description={`Customer ${customerRef}`} />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <DataTable columns={["Scheme", "Name", "Units", "Value"]} rows={rows} />
        </Card>
      )}
    </>
  );
}
