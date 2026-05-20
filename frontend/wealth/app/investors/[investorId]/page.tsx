"use client";

import { FormEvent, useEffect, useState, use } from "react";
import { apiGet, apiPut } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Button, Card, Input, LoadingState, PageHeader } from "@/components/ui";

export default function InvestorProfilePage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const { data, error, loading, reload } = useApiData(
    () => apiGet<ApiResponse<Record<string, string>>>(`/investors/${investorId}`),
    [investorId]
  );

  const profile = data?.data;
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? profile.name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const res = await apiPut<ApiResponse>(`/investors/${investorId}`, form);
      setSaveSuccess(res.message || "Profile updated");
      reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <>
      <PageHeader title="Investor Profile" description={`Profile for ${investorId}`} />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}
      {profile && (
        <Card className="max-w-lg">
          <dl className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">PAN</dt>
              <dd>{profile.pan_number ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Demat</dt>
              <dd>{profile.demat_account ?? "—"}</dd>
            </div>
          </dl>
          <form onSubmit={onSubmit} className="space-y-4 border-t border-zinc-200 pt-6">
            <h2 className="font-medium text-zinc-900">Update profile</h2>
            {saveError && <Alert message={saveError} />}
            {saveSuccess && <Alert message={saveSuccess} type="success" />}
            <Input label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Button type="submit">Save changes</Button>
          </form>
        </Card>
      )}
    </>
  );
}
