"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const linkClass = (active: boolean) =>
  `block rounded-lg px-3 py-2 text-sm transition ${
    active
      ? "bg-emerald-50 font-medium text-emerald-800"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
  }`;

export function Sidebar() {
  const pathname = usePathname();
  const { user, investorId, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const customerRef =
    typeof window !== "undefined"
      ? localStorage.getItem("wealth_customer_ref") || "DEVA001"
      : "DEVA001";

  const investorLinks = investorId
    ? [
        { href: `/holdings/${investorId}`, label: "My Holdings" },
        { href: `/holdings/${investorId}/summary`, label: "Portfolio Summary" },
        { href: `/portfolio/${investorId}`, label: "Portfolio Details" },
        { href: `/transactions/${investorId}`, label: "Transactions" },
        { href: `/investors/${investorId}`, label: "Profile" },
      ]
    : [];

  const mfLinks = [
    { href: `/funds/${customerRef}`, label: "MF Investments" }
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-5">
        <Link href="/" className="text-lg font-semibold text-emerald-800">
          Wealth Platform
        </Link>
        {user && (
          <p className="mt-1 truncate text-xs text-zinc-500">
            {user.full_name || user.email}
            {user.role && ` · ${user.role}`}
          </p>
        )}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {isAdmin && (
          <>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Admin
              </p>
              <div className="space-y-1">
                <Link href="/dashboard" className={linkClass(pathname === "/dashboard")}>
                  Dashboard
                </Link>
                <Link href="/admin/investors" className={linkClass(pathname === "/admin/investors")}>
                  Investors
                </Link>
                
              </div>
            </section>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                System
              </p>
              <Link href="/health" className={linkClass(pathname === "/health")}>
                Health Monitoring
              </Link>
            </section>
          </>
        )}
        {!isAdmin && (
          <>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Equity
              </p>
              <div className="space-y-1">
                {investorLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Market
              </p>
              <Link href="/market/prices" className={linkClass(pathname.startsWith("/market/prices"))}>
                Stock Prices
              </Link>
            </section>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Mutual Funds
              </p>
              <div className="space-y-1">
                {mfLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                System
              </p>
              <Link href="/health" className={linkClass(pathname === "/health")}>
                Health Monitoring
              </Link>
            </section>
          </>
        )}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <button
          type="button"
          onClick={() => logout()}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
