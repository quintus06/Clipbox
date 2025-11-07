// src/contexts/auth-context.tsx
// Contexte d'authentification React

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "CLIPPER" | "ADVERTISER" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ redirectUrl: string } | void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "CLIPPER" | "ADVERTISER";
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Récupérer l'utilisateur au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me");
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      setUser(data.user);
      
      // Retourner l'URL de redirection pour que le composant puisse l'utiliser
      return { redirectUrl: data.redirectUrl };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur d'inscription");
      }

      // L'utilisateur est automatiquement connecté après l'inscription
      setUser(data.user);
      
      // Redirection basée sur le rôle
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user state first
      setUser(null);
      
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Force redirect to landing page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, still redirect to landing page
      window.location.href = "/";
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Si le refresh échoue, déconnecter l'utilisateur
        setUser(null);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      setUser(null);
    }
  };

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user]
  );

  // Rafraîchir le token toutes les 20 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshToken();
      }, 20 * 60 * 1000); // 20 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}