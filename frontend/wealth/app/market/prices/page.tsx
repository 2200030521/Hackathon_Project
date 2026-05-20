"use client";

import Link from "next/link";
import { useState } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, Card, DataTable, LoadingState, PageHeader } from "@/components/ui";
import { tableRow } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-lg text-sm">
      {label && <p className="mb-1 font-semibold text-zinc-700">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function MarketPricesPage() {
  const { data, error, loading } = useApiData(() =>
    apiGet<ApiResponse<Record<string, unknown>[]>>("/market/prices")
  );

  const [view, setView] = useState<"charts" | "table">("charts");

  const prices = Array.isArray(data?.data) ? data.data : [];

  // Only real fields from the API
  const enriched = prices.map((p) => ({
    symbol:            String(p.stock_symbol ?? p.symbol ?? ""),
    company_name:      String(p.company_name ?? ""),
    current_price:     Number(p.current_price ?? 0),
    day_change_percent: Number(p.day_change_percent ?? p.change_percent ?? 0),
    exchange:          String(p.exchange ?? ""),
  }));

  // Chart 1 — Current price per symbol
  const priceData = enriched.map((p) => ({
    name: p.symbol,
    Price: p.current_price,
  }));

  // Chart 2 — Day change % per symbol (green/red)
  const changeData = enriched.map((p) => ({
    name: p.symbol,
    "Change %": parseFloat(p.day_change_percent.toFixed(2)),
  }));

  const rows = prices.map((p) =>
    tableRow(
      p.stock_symbol ?? p.symbol,
      p.company_name,
      p.current_price,
      p.day_change_percent ?? p.change_percent,
      p.exchange
    )
  );

  return (
    <>
      <PageHeader title="Stock Prices" description="Live market data" />
      {loading && <LoadingState />}
      {error && <Alert message={error} />}

      {!loading && !error && (
        <div className="space-y-6">

          {/* Toggle */}
          <div className="flex gap-2">
            {(["charts", "table"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
                  view === t
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                {t === "charts" ? "Charts" : "Table"}
              </button>
            ))}
          </div>

          {/* Charts */}
          {view === "charts" && (
            <div className="grid gap-6 xl:grid-cols-2">

              {/* Current Price */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Current Price per Symbol
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={priceData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="Price" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Day Change % */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Day Change % per Symbol
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={changeData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11, fill: "#71717a" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <ReferenceLine y={0} stroke="#d1d5db" />
                    <Bar dataKey="Change %" radius={[6, 6, 0, 0]}>
                      {changeData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry["Change %"] >= 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </div>
          )}

          {/* Table */}
          {view === "table" && (
            <Card>
              <DataTable
                columns={["Symbol", "Company", "Price", "Change %", "Exchange"]}
                rows={rows}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {enriched.map((p) => (
                  <Link
                    key={p.symbol}
                    href={`/market/prices/${p.symbol}`}
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    {p.symbol} details →
                  </Link>
                ))}
              </div>
            </Card>
          )}

        </div>
      )}
    </>
  );
}