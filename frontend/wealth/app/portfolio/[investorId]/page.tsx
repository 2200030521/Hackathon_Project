"use client";

import { use } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, LoadingState, PageHeader } from "@/components/ui";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  CircleDollarSign,
  Hash,
  ToggleLeft,
} from "lucide-react";

// ─── Recursive value renderer ─────────────────────────────────────────────────

function ValueBadge({ value }: { value: unknown }) {
  if (typeof value === "boolean") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          value
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        <ToggleLeft className="h-3 w-3" />
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (typeof value === "number") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        <Hash className="h-3 w-3" />
        {value.toLocaleString()}
      </span>
    );
  }

  const str = String(value ?? "—");

  // Currency-like values
  if (/^[\$₹€£]|^\d[\d,]+\.\d{2}$/.test(str)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CircleDollarSign className="h-3 w-3" />
        {str}
      </span>
    );
  }

  return (
    <span className="text-sm font-semibold text-zinc-900">{str}</span>
  );
}

function DataRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
      <span className="text-sm font-medium capitalize text-zinc-500">
        {label.replaceAll("_", " ")}
      </span>
      <ValueBadge value={value} />
    </div>
  );
}

function NestedSection({
  title,
  data,
  depth = 0,
}: {
  title: string;
  data: Record<string, unknown>;
  depth?: number;
}) {
  const entries = Object.entries(data);
  const primitives = entries.filter(([, v]) => typeof v !== "object" || v === null);
  const nested = entries.filter(([, v]) => typeof v === "object" && v !== null);

  return (
    <div
      className={`rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
        depth > 0 ? "border-zinc-100 shadow-none hover:shadow-sm" : ""
      }`}
    >
      {/* Card header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
          {depth === 0 ? (
            <Briefcase className="h-5 w-5 text-zinc-600" />
          ) : (
            <BarChart3 className="h-5 w-5 text-zinc-500" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {depth === 0 ? "Portfolio Section" : "Details"}
          </p>
          <h3 className="text-base font-semibold capitalize text-zinc-900">
            {title.replaceAll("_", " ")}
          </h3>
        </div>
      </div>

      {/* Primitive key-value rows */}
      {primitives.length > 0 && (
        <div className="mb-4 space-y-2">
          {primitives.map(([k, v]) => (
            <DataRow key={k} label={k} value={v} />
          ))}
        </div>
      )}

      {/* Nested objects */}
      {nested.length > 0 && (
        <div className="space-y-4">
          {nested.map(([k, v]) =>
            Array.isArray(v) ? (
              <ArraySection key={k} title={k} items={v} depth={depth + 1} />
            ) : (
              <NestedSection
                key={k}
                title={k}
                data={v as Record<string, unknown>}
                depth={depth + 1}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function ArraySection({
  title,
  items,
  depth = 0,
}: {
  title: string;
  items: unknown[];
  depth?: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ChevronRight className="h-4 w-4 text-zinc-400" />
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {title.replaceAll("_", " ")}
          <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-500">
            {items.length}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) =>
          typeof item === "object" && item !== null ? (
            <NestedSection
              key={i}
              title={`${title.replaceAll("_", " ")} ${i + 1}`}
              data={item as Record<string, unknown>}
              depth={depth + 1}
            />
          ) : (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5"
            >
              <span className="text-xs text-zinc-400">#{i + 1}</span>
              <ValueBadge value={item} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PortfolioRenderer({ data }: { data: unknown }) {
  if (data === null || data === undefined) return null;

  if (typeof data !== "object") {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <ValueBadge value={data} />
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-6">
        {data.map((item, i) =>
          typeof item === "object" && item !== null ? (
            <NestedSection
              key={i}
              title={`Item ${i + 1}`}
              data={item as Record<string, unknown>}
            />
          ) : (
            <div key={i} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <ValueBadge value={item} />
            </div>
          )
        )}
      </div>
    );
  }

  const entries = Object.entries(data as Record<string, unknown>);
  const primitives = entries.filter(([, v]) => typeof v !== "object" || v === null);
  const nested = entries.filter(([, v]) => typeof v === "object" && v !== null);

  return (
    <div className="space-y-6">
      {/* Top-level primitives as a single summary card */}
      {primitives.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
              <CircleDollarSign className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Summary
              </p>
              <h3 className="text-base font-semibold text-zinc-900">
                Portfolio Overview
              </h3>
            </div>
          </div>
          <div className="space-y-2">
            {primitives.map(([k, v]) => (
              <DataRow key={k} label={k} value={v} />
            ))}
          </div>
        </div>
      )}

      {/* Nested sections as individual cards */}
      {nested.map(([k, v]) =>
        Array.isArray(v) ? (
          <div key={k} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <ArraySection title={k} items={v} />
          </div>
        ) : (
          <NestedSection
            key={k}
            title={k}
            data={v as Record<string, unknown>}
          />
        )
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioDetailsPage({
  params,
}: {
  params: Promise<{ investorId: string }>;
}) {
  const { investorId } = use(params);
  const { data, error, loading } = useApiData(
    () => apiGet<ApiResponse<unknown>>(`/portfolio/${investorId}`),
    [investorId]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Details"
        description={`Unified portfolio view for investor ${investorId}`}
      />

      {loading && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
          <LoadingState />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <Alert message={error} />
        </div>
      )}

      {data?.data && <PortfolioRenderer data={data.data} />}
    </div>
  );
}