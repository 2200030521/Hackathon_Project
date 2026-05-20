import Cookies from "js-cookie";
import type { AuthUser } from "./types";

const ACCESS = "wealth_access_token";
const REFRESH = "wealth_refresh_token";
const USER = "wealth_user";

const opts = { sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH);
}

export function getStoredUser(): AuthUser | null {
  const raw = Cookies.get(USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthCookies(
  accessToken: string,
  refreshToken: string | null,
  user: AuthUser
): void {
  Cookies.set(ACCESS, accessToken, { ...opts, expires: 1 });
  if (refreshToken) {
    Cookies.set(REFRESH, refreshToken, { ...opts, expires: 7 });
  }
  Cookies.set(USER, JSON.stringify(user), { ...opts, expires: 7 });
}

export function setAccessToken(accessToken: string): void {
  Cookies.set(ACCESS, accessToken, { ...opts, expires: 1 });
}

export function clearAuthCookies(): void {
  Cookies.remove(ACCESS, { path: "/" });
  Cookies.remove(REFRESH, { path: "/" });
  Cookies.remove(USER, { path: "/" });
}

export function getInvestorId(user: AuthUser | null): string | undefined {
  if (!user) return undefined;
  return user.investor_id ?? user.id;
}
