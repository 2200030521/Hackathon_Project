"use client";

import { FormEvent, useState } from "react";
import { mfPost } from "@/lib/mfApi";
import type { ApiResponse } from "@/lib/types";
import { Alert, Button, Card, Input, PageHeader } from "@/components/ui";

export default function CreateSipPage() {
  const [form, setForm] = useState({
    customerRef: "DEVA001",
    schemeCode: "",
    amount: "",
    frequency: "MONTHLY",
    startDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await mfPost<ApiResponse>("/sip", {
        customerRef: form.customerRef,
        schemeCode: form.schemeCode,
        amount: Number(form.amount),
        frequency: form.frequency,
        startDate: form.startDate,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("wealth_customer_ref", form.customerRef);
      }
      setSuccess(res.message || "SIP created");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create SIP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Create SIP" description="Start a new systematic investment plan" />
      <Card className="max-w-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert message={error} />}
          {success && <Alert message={success} type="success" />}
          <Input label="Customer ref" required value={form.customerRef} onChange={(e) => setForm({ ...form, customerRef: e.target.value })} />
          <Input label="Scheme code" required value={form.schemeCode} onChange={(e) => setForm({ ...form, schemeCode: e.target.value })} />
          <Input label="Amount" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
          <Input label="Start date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create SIP"}</Button>
        </form>
      </Card>
    </>
  );
}
