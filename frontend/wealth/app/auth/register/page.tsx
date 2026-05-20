"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Card, Input } from "@/components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    pan_number: "",
    demat_account: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <Alert message={error} />}
          <Input
            label="Full name"
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Input
            label="PAN number"
            required
            placeholder="ABCDE1234F"
            value={form.pan_number}
            onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
          />
          <Input
            label="Demat account"
            required
            value={form.demat_account}
            onChange={(e) => setForm({ ...form, demat_account: e.target.value })}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
