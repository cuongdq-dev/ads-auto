"use client";

import { deleteCookie, getCookie, setCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (mockToken: string, mockUser: User) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const clearAuth = useCallback(() => {
    deleteCookie("token");
    deleteCookie("refresh-token");
    deleteCookie("user-info");
  }, []);

  const checkAuth = useCallback(() => {
    const token = getCookie("token");
    const userData = getCookie("user-info");

    if (token && userData) {
      try {
        const decodedData = decodeURIComponent(userData);
        setUser(JSON.parse(decodedData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        clearAuth();
      }
    }
    setIsLoading(false);
  }, [clearAuth]);

  const login = useCallback(
    async (mockToken: string, mockUser: User) => {
      try {
        const encodedUserData = encodeURIComponent(JSON.stringify(mockUser));
        setCookie("token", mockToken, 7); // 7 days
        setCookie("refresh-token", encodedUserData, 7);
        setCookie("user-info", encodedUserData, 7);
        setUser(mockUser);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    clearAuth();
    setUser(null);
    router.push("/login");
  }, [clearAuth, router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, isLoading, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
