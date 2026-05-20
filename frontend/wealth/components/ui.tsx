import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50";
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-zinc-600 hover:bg-zinc-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      <input
        className={`w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Alert({
  message,
  type = "error",
}: {
  message: string;
  type?: "error" | "success";
}) {
  const colors =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${colors}`}>{message}</div>
  );
}

export function LoadingState() {
  return (
    <p className="flex items-center justify-center py-16 text-sm text-zinc-500">
      Loading…
    </p>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-zinc-500">{message}</p>;
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  if (!rows.length) return <EmptyState message="No data found." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-zinc-800">
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
