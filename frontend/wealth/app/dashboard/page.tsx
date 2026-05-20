"use client";

import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";

import {
  Alert,
  Card,
  LoadingState,
  PageHeader,
} from "@/components/ui";

import {
  Activity,
  CheckCircle2,
  Clock3,
  Database,
  Server,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface HealthResponse {
  status: string;
  timestamp: string;
  service?: string;
  redis?: string;
  traceId?: string;
}

interface HealthData {
  platform: HealthResponse;
  equity_service: HealthResponse;
  mf_service: HealthResponse;
}

export default function DashboardPage() {
  const { data, error, loading } = useApiData(() =>
    apiGet<ApiResponse<Record<string, any>>>("/dashboard")
  );

  const {
    data: healthData,
    error: healthError,
    loading: healthLoading,
  } = useApiData(() => apiGet<ApiResponse<HealthData>>("/serviceHealth"));

  const dashboardData = data?.data || {};
  const entries = Object.entries(dashboardData);

  const health = healthData?.data;
  const services = health
    ? [
        { title: "Platform Core",       icon: Activity, data: health.platform },
        { title: "Equity Service",      icon: Server,   data: health.equity_service },
        { title: "Mutual Fund Service", icon: Database, data: health.mf_service },
      ]
    : [];

  const healthyCount   = services.filter((s) => s.data?.status === "UP").length;
  const isFullyHealthy = services.length > 0 && healthyCount === services.length;

  const isLoading = loading || healthLoading;
  const combinedError = error || healthError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        description="Platform-wide statistics and service health overview"
      />

      {/* Loading */}
      {isLoading && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
          <LoadingState />
        </div>
      )}

      {/* Error */}
      {combinedError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <Alert message={combinedError} />
        </div>
      )}

      {/* Content */}
      {!isLoading && !combinedError && (
        <>
          {/* ── Summary strip ─────────────────────────────────────── */}
          <div className="grid gap-5 md:grid-cols-4">
            {/* Total Metrics */}
            <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Total Metrics</p>
                  <h2 className="mt-2 text-4xl font-bold text-zinc-900">
                    {entries.length}
                  </h2>
                </div>
                <div className="rounded-2xl bg-blue-100 p-4">
                  <Activity className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* API Status */}
            <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">API Status</p>
                  <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                    Operational
                  </h2>
                </div>
                <div className="rounded-2xl bg-emerald-100 p-4">
                  <ShieldCheck className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
            </Card>

            {/* Connected Services */}
            <Card className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Connected Services</p>
                  <h2 className="mt-2 text-4xl font-bold text-violet-600">
                    {entries.filter(([, v]) => typeof v === "object").length}
                  </h2>
                </div>
                <div className="rounded-2xl bg-violet-100 p-4">
                  <Server className="h-7 w-7 text-violet-600" />
                </div>
              </div>
            </Card>

            {/* Health Summary */}
            <Card
              className={`rounded-3xl border p-6 shadow-sm ${
                isFullyHealthy
                  ? "border-emerald-200 bg-white"
                  : "border-amber-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Service Health</p>
                  <h2
                    className={`mt-2 text-2xl font-bold ${
                      isFullyHealthy ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {healthyCount}/{services.length} Healthy
                  </h2>
                </div>
                <div
                  className={`rounded-2xl p-4 ${
                    isFullyHealthy ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  <CheckCircle2
                    className={`h-7 w-7 ${
                      isFullyHealthy ? "text-emerald-600" : "text-amber-600"
                    }`}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* ── Dashboard metric cards ─────────────────────────────── */}
          {data?.data && (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Dashboard Metrics
              </h3>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {entries.map(([key, value], index) => (
                  <Card
                    key={index}
                    className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                          {key.replaceAll("_", " ")}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                          Dashboard Metric
                        </h2>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-3">
                        <Database className="h-6 w-6 text-zinc-700" />
                      </div>
                    </div>

                    {typeof value === "object" && value !== null ? (
                      <div className="space-y-3">
                        {Object.entries(value).map(([subKey, subValue], i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3"
                          >
                            <span className="text-sm font-medium capitalize text-zinc-500">
                              {subKey}
                            </span>
                            <span className="text-sm font-semibold text-zinc-900">
                              {String(subValue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-zinc-50 p-5 text-center">
                        <p className="text-3xl font-bold text-zinc-900">
                          {String(value)}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── Health service cards ───────────────────────────────── */}
          {services.length > 0 && (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Service Health
              </h3>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const isUp = service.data?.status === "UP";

                  return (
                    <Card
                      key={index}
                      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                            <Icon className="h-7 w-7 text-zinc-700" />
                          </div>
                          <h2 className="text-lg font-semibold text-zinc-900">
                            {service.title}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-500">
                            {service.data?.service || "Core Platform"}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            isUp
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isUp ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          {service.data?.status}
                        </div>
                      </div>

                      <div className="my-5 border-t border-zinc-100" />

                      {/* Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Clock3 className="h-4 w-4" />
                            Last Updated
                          </div>
                          <span className="text-sm font-medium text-zinc-800">
                            {new Date(
                              service.data?.timestamp
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        {service.data?.redis && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">Redis</span>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {service.data.redis}
                            </span>
                          </div>
                        )}

                        {service.data?.traceId && (
                          <div>
                            <p className="mb-2 text-sm text-zinc-500">Trace ID</p>
                            <div className="overflow-auto rounded-xl bg-zinc-100 p-3 text-xs text-zinc-700">
                              {service.data.traceId}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}