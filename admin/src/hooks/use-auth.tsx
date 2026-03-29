/**
 * @file use-auth.tsx
 * @description Authentication hook and provider — manages login, logout, token refresh, and current user context
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Role } from "@/lib/types";
import {
  auth as authApi,
  setTokens,
  clearTokens,
  getAccessToken,
  ApiError,
} from "@/lib/api";

// Backend uses UPPER_CASE roles; frontend uses lowercase
const ROLE_MAP: Record<string, Role> = {
  SUPER_ADMIN: "admin",
  ADMIN: "admin",
  HOD: "hod",
  TPO: "tpo",
  MEDIA_MANAGER: "media_manager",
  NEWS_EDITOR: "news_editor",
};

function mapBackendUser(data: Record<string, unknown>): User {
  const backendRole = String(data.role ?? "");
  const dept = data.department as { id?: string; slug?: string } | undefined;

  return {
    id: String(data.id),
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    role: ROLE_MAP[backendRole] ?? "admin",
    departmentId: dept?.id ?? (data.departmentId as string | undefined),
    departmentSlug: dept?.slug,
    avatarUrl: data.avatarUrl as string | undefined,
    isActive: Boolean(data.isActive),
    lastLogin: data.lastLoginAt as string | undefined,
    createdAt: String(data.createdAt ?? ""),
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, check if we have a valid token and fetch user profile
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      // Use queueMicrotask to avoid synchronous setState in effect body
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(mapBackendUser(res.data));
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      setTokens(res.data.accessToken, res.data.refreshToken);

      // Fetch full user profile
      const meRes = await authApi.me();
      const mapped = mapBackendUser(meRes.data);

      // Only allow admin-type users into the admin panel
      if (!ROLE_MAP[String(meRes.data.role)]) {
        clearTokens();
        setError("Access denied. Admin credentials required.");
        setIsLoading(false);
        return false;
      }

      setUser(mapped);
      setIsLoading(false);
      return true;
    } catch (err) {
      clearTokens();
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
