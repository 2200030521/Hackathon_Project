"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";

export default function NavInfoPage({
  params,
}: {
  params: Promise<{ schemeCode: string }>;
}) {
  const { schemeCode } = use(params);
  const { data, error, loading } = useApiData(
    () => apiGet<ApiResponse<unknown>>(`/nav/${schemeCode}`),
    [schemeCode]
  );

  return (
    <>
      <PageHeader title="NAV Info" description={`Scheme ${schemeCode}`} />
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
