import type { ApiResponse } from "./types";

async function mfFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`/api/mf${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((json as ApiResponse).message || res.statusText);
  }

  return json as T;
}

export function mfGet<T>(path: string): Promise<T> {
  return mfFetch<T>(path, { method: "GET" });
}

export function mfPost<T>(path: string, body?: unknown): Promise<T> {
  return mfFetch<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function mfPatch<T>(path: string, body?: unknown): Promise<T> {
  return mfFetch<T>(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
