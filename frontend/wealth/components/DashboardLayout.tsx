"use client";

import { AppShell } from "./AppShell";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "./ui";
import type { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <LoadingState />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
