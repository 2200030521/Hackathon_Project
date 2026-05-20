"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "./DashboardLayout";
import type { ReactNode } from "react";

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  if (isAuth) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
