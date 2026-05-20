"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mfPatch } from "@/lib/mfApi";
import type { ApiResponse } from "@/lib/types";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";

export default function StopSipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await mfPatch<ApiResponse>(`/sip/${id}/stop`);
        setMessage(res.message || "SIP stopped successfully");
        setTimeout(() => router.push("/sips/DEVA001"), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to stop SIP");
      }
    })();
  }, [id, router]);

  return (
    <>
      <PageHeader title="Stop SIP" description={`Stopping SIP ${id}`} />
      <Card className="max-w-md">
        {!message && !error && <LoadingState />}
        {message && <Alert message={message} type="success" />}
        {error && <Alert message={error} />}
      </Card>
    </>
  );
}
