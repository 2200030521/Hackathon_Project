export type UserRole = "ADMIN" | "INVESTOR";

export interface AuthUser {
  id?: string;
  investor_id?: string;
  full_name?: string;
  name?: string;
  email: string;
  role?: UserRole;
  pan_number?: string;
  demat_account?: string;
  phone?: string;
  address?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
