"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { Alert, Card, LoadingState, PageHeader } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

interface Investor {
  investor_id: string;
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  created_at: string;
}

interface InvestorWithInvestments extends Investor {
  holdings_count?: number;
  total_investment?: number;
  total_current_value?: number;
  return_pct?: number;
}

// ── Colour palette ────────────────────────────────────────────────────────────
const PALETTE = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

// ── Formatters ────────────────────────────────────────────────────────────────
const inr = (v: number) =>
  `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const shortInr = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000) return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v}`;
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, currency = false }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-lg text-sm">
      {label && <p className="mb-1 font-semibold text-zinc-700">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {currency ? inr(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "text-zinc-900" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InvestorsManagementPage() {
  const [investors, setInvestors] = useState<InvestorWithInvestments[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"charts" | "table">("charts");

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const res = await apiGet<ApiResponse<Investor[]>>("/investors");
        if (Array.isArray(res.data)) {
          const investorsWithData = await Promise.all(
            res.data.map(async (investor) => {
              try {
                const holdingsRes = await apiGet<ApiResponse>(`/holdings/${investor.investor_id}`);
                const holdings = Array.isArray(holdingsRes.data) ? holdingsRes.data : [];
                const totalInvestment = holdings.reduce(
                  (sum: number, h: any) => sum + Number(h.quantity) * Number(h.avg_buy_price), 0
                );
                const totalCurrentValue = holdings.reduce(
                  (sum: number, h: any) => sum + Number(h.quantity) * Number(h.current_market_price), 0
                );
                const return_pct =
                  totalInvestment > 0
                    ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100
                    : 0;
                return { ...investor, holdings_count: holdings.length, total_investment: totalInvestment, total_current_value: totalCurrentValue, return_pct };
              } catch {
                return { ...investor, holdings_count: 0, total_investment: 0, total_current_value: 0, return_pct: 0 };
              }
            })
          );
          setInvestors(investorsWithData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load investors");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const totalInvested   = investors.reduce((s, i) => s + (i.total_investment   ?? 0), 0);
  const totalCurrent    = investors.reduce((s, i) => s + (i.total_current_value ?? 0), 0);
  const totalHoldings   = investors.reduce((s, i) => s + (i.holdings_count ?? 0), 0);
  const overallReturn   = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  // Bar chart: invested vs current per investor (top 8)
  const barData = [...investors]
    .sort((a, b) => (b.total_current_value ?? 0) - (a.total_current_value ?? 0))
    .slice(0, 8)
    .map((inv) => ({
      name: inv.full_name?.split(" ")[0] ?? inv.investor_id,
      Invested: inv.total_investment ?? 0,
      "Current Value": inv.total_current_value ?? 0,
    }));

  // Pie: portfolio share by current value
  const pieData = investors
    .filter((inv) => (inv.total_current_value ?? 0) > 0)
    .map((inv) => ({
      name: inv.full_name?.split(" ")[0] ?? inv.investor_id,
      value: inv.total_current_value ?? 0,
    }));

  // Line: return % per investor
  const returnData = [...investors]
    .sort((a, b) => (b.return_pct ?? 0) - (a.return_pct ?? 0))
    .map((inv) => ({
      name: inv.full_name?.split(" ")[0] ?? inv.investor_id,
      "Return %": parseFloat((inv.return_pct ?? 0).toFixed(2)),
    }));

  // Holdings distribution bar
  const holdingsData = [...investors]
    .sort((a, b) => (b.holdings_count ?? 0) - (a.holdings_count ?? 0))
    .slice(0, 8)
    .map((inv) => ({
      name: inv.full_name?.split(" ")[0] ?? inv.investor_id,
      Holdings: inv.holdings_count ?? 0,
    }));

  return (
    <>
      <PageHeader
        title="Investors Management"
        description="Portfolio analytics and investor overview"
      />

      {loading && <LoadingState />}
      {error && <Alert message={error} />}

      {!loading && !error && (
        <div className="space-y-6">

          {/* ── Toggle ─────────────────────────────────────────────────── */}
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

          {/* ── Summary strip ──────────────────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Investors"  value={String(investors.length)} sub="registered accounts" />
            <StatCard label="Total Invested"   value={shortInr(totalInvested)}  sub="across all portfolios" />
            <StatCard label="Current Value"    value={shortInr(totalCurrent)}   sub="mark-to-market" color={totalCurrent >= totalInvested ? "text-emerald-600" : "text-red-500"} />
            <StatCard
              label="Overall Return"
              value={`${overallReturn >= 0 ? "+" : ""}${overallReturn.toFixed(2)}%`}
              sub="blended portfolio return"
              color={overallReturn >= 0 ? "text-emerald-600" : "text-red-500"}
            />
          </div>

          {/* ── Charts view ────────────────────────────────────────────── */}
          {view === "charts" && (
            <div className="grid gap-6 xl:grid-cols-2">

              {/* Invested vs Current Value */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Invested vs Current Value
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={shortInr} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip currency />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Invested"      fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Current Value" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Portfolio share pie */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Portfolio Share by Current Value
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => inr(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Return % bar */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Return % per Investor
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={returnData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11, fill: "#71717a" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <Bar dataKey="Return %" radius={[6, 6, 0, 0]}>
                      {returnData.map((entry, i) => (
                        <Cell key={i} fill={entry["Return %"] >= 0 ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Holdings count bar */}
              <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  Holdings Count per Investor
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={holdingsData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="Holdings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </div>
          )}

          {/* ── Table view ─────────────────────────────────────────────── */}
          {view === "table" && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      {["Investor ID","Name","Email","PAN","Holdings","Invested","Current Value","Return %"].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 font-medium text-zinc-600 ${
                            ["Holdings","Invested","Current Value","Return %"].includes(h) ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((inv, idx) => {
                      const ret = inv.return_pct ?? 0;
                      return (
                        <tr key={inv.investor_id} className={idx % 2 === 0 ? "bg-zinc-50" : ""}>
                          <td className="px-4 py-3 text-zinc-900">{inv.investor_id}</td>
                          <td className="px-4 py-3 text-zinc-900">{inv.full_name}</td>
                          <td className="px-4 py-3 text-zinc-700">{inv.email}</td>
                          <td className="px-4 py-3 text-zinc-700">{inv.pan_number}</td>
                          <td className="px-4 py-3 text-right font-medium text-zinc-900">{inv.holdings_count ?? 0}</td>
                          <td className="px-4 py-3 text-right text-zinc-900">
                            {inr(inv.total_investment ?? 0)}
                          </td>
                          <td className="px-4 py-3 text-right text-zinc-900">
                            {inr(inv.total_current_value ?? 0)}
                          </td>
                          <td className={`px-4 py-3 text-right font-medium ${ret >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {inv.total_investment ? `${ret >= 0 ? "+" : ""}${ret.toFixed(2)}%` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {investors.length === 0 && (
                  <div className="p-6 text-center text-zinc-500">No investors found</div>
                )}
              </div>
            </Card>
          )}

        </div>
      )}
    </>
  );
}