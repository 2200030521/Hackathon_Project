"use client";

import Link from "next/link";
import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Button, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";

export default function SipManagementPage({
  params,
}: {
  params: Promise<{ customerRef: string }>;
}) {
  const { customerRef } = use(params);
  const { data, error, loading, reload } = useApiData(
    () => apiGet<ApiResponse<Record<string, unknown>[]>>(`/sips/${customerRef}`),
    [customerRef]
  );

  const sips = Array.isArray(data?.data) ? data.data : [];
  const rows = sips.map((s) => tableRow(s.id, s.scheme_code, s.amount, s.status ?? s.frequency));

  return (
    <>
      <PageHeader
        title="SIP Management"
        description={`Active SIPs for ${customerRef}`}
        actions={
          <Link href="/sip">
            <Button>Create SIP</Button>
          </Link>
        }
      />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {!loading && !error && (
        <Card>
          <DataTable columns={["ID", "Scheme", "Amount", "Status"]} rows={rows} />
          <div className="mt-4 space-y-2">
            {sips.map((s) => (
              <div key={String(s.id)} className="flex items-center justify-between border-t border-zinc-100 pt-2">
                <span className="text-sm text-zinc-600">SIP {String(s.id)}</span>
                <Link href={`/sip/${s.id}/stop`}>
                  <Button variant="danger" type="button" onClick={() => reload()}>
                    Stop
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
