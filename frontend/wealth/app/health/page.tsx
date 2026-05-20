"use client";

import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { useApiData } from "@/hooks/useApiData";
import { Alert, LoadingState, PageHeader } from "@/components/ui";

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

export default function HealthPage() {
  const { data, error, loading } = useApiData(() =>
    apiGet<
      ApiResponse<{
        platform: HealthResponse;
        equity_service: HealthResponse;
        mf_service: HealthResponse;
      }>
    >("/serviceHealth")
  );

  const health = data?.data;

  const services = health
    ? [
        {
          title: "Platform Core",
          icon: Activity,
          data: health.platform,
        },
        {
          title: "Equity Service",
          icon: Server,
          data: health.equity_service,
        },
        {
          title: "Mutual Fund Service",
          icon: Database,
          data: health.mf_service,
        },
      ]
    : [];

  const healthyServices = services.filter(
    (service) => service.data?.status === "UP"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Health Monitoring"
        description="Monitor platform infrastructure and downstream services"
      />

      {/* Loading */}
      {loading && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
          <LoadingState />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <Alert message={error} />
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && health && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Total */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Total Services
                  </p>

                  <h2 className="mt-2 text-4xl font-bold text-zinc-900">
                    {services.length}
                  </h2>
                </div>

                <div className="rounded-2xl bg-zinc-100 p-4">
                  <Activity className="h-7 w-7 text-zinc-700" />
                </div>
              </div>
            </div>

            {/* Healthy */}
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Healthy Services
                  </p>

                  <h2 className="mt-2 text-4xl font-bold text-emerald-600">
                    {healthyServices}
                  </h2>
                </div>

                <div className="rounded-2xl bg-emerald-100 p-4">
                  <ShieldCheck className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Platform Status
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-blue-600">
                    {healthyServices === services.length
                      ? "Operational"
                      : "Issues Detected"}
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-100 p-4">
                  <CheckCircle2 className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isUp = service.data.status === "UP";

              return (
                <div
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
                        {service.data.service || "Core Platform"}
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

                      {service.data.status}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-zinc-100"></div>

                  {/* Details */}
                  <div className="space-y-4">
                    {/* Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock3 className="h-4 w-4" />
                        Last Updated
                      </div>

                      <span className="text-sm font-medium text-zinc-800">
                        {new Date(
                          service.data.timestamp
                        ).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Redis */}
                    {service.data.redis && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">
                          Redis
                        </span>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {service.data.redis}
                        </span>
                      </div>
                    )}

                    {/* Trace ID */}
                    {service.data.traceId && (
                      <div>
                        <p className="mb-2 text-sm text-zinc-500">
                          Trace ID
                        </p>

                        <div className="overflow-auto rounded-xl bg-zinc-100 p-3 text-xs text-zinc-700">
                          {service.data.traceId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}