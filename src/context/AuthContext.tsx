"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VipUser } from "@/lib/auth";

interface AuthContextType {
  user: VipUser | null;
  isVip: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isVip: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

const STORAGE_KEY = "movbazaar_vip_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<VipUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize from localStorage immediately to avoid layout flicker
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isVip) {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore JSON error
    }

    // Verify session with server
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isVip && data?.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        } else {
          // If server reports expired or invalid session, clear
          if (!localStorage.getItem(STORAGE_KEY)) {
            setUser(null);
          }
        }
      })
      .catch(() => {
        // Offline or serverless cold start - rely on localStorage
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        } catch {
          // Ignore storage error
        }
        setIsLoginModalOpen(false);
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message || "Invalid VIP credentials.",
        };
      }
    } catch {
      return {
        success: false,
        message: "Failed to connect to authentication server.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors
    }
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isVip: Boolean(user?.isVip),
        isLoading,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
