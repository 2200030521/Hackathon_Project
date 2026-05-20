"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import {
  clearAuthCookies,
  getAccessToken,
  getInvestorId,
  getRefreshToken,
  getStoredUser,
  setAuthCookies,
  setAccessToken,
} from "@/lib/cookies";
import type { ApiResponse, AuthUser, LoginResult } from "@/lib/types";

interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  pan_number: string;
  demat_account: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  investorId: string | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiPost<ApiResponse<LoginResult>>("/auth/login", {
        email,
        password,
      });
      if (!res.data?.accessToken) {
        throw new Error(res.message || "Login failed");
      }
      const u = res.data.user;
      setAuthCookies(res.data.accessToken, res.data.refreshToken, u);
      setUser(u);
      router.push(u.role === "ADMIN" ? "/dashboard" : `/holdings/${getInvestorId(u)}`);
    },
    [router]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await apiPost<ApiResponse>("/auth/register", input);
      router.push("/auth/login?registered=1");
    },
    [router]
  );

  const logout = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await apiPost("/auth/logout");
      } catch {
        /* ignore */
      }
    }
    clearAuthCookies();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  const refreshTokenFn = useCallback(async (): Promise<boolean> => {
    const access = getAccessToken();
    const refresh = getRefreshToken();
    if (!access || !refresh) return false;

    try {
      const res = await apiPost<ApiResponse<{ accessToken: string }>>(
        "/auth/refresh",
        { refreshToken: refresh }
      );
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        return true;
      }
    } catch {
      clearAuthCookies();
      setUser(null);
    }
    return false;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      investorId: getInvestorId(user),
      isLoading,
      isAuthenticated: !!user && !!getAccessToken(),
      login,
      register,
      logout,
      refreshToken: refreshTokenFn,
    }),
    [user, isLoading, login, register, logout, refreshTokenFn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
