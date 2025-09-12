// src/providers/auth-provider.tsx
// Provider d'authentification personnalisé

"use client";

import { ReactNode } from "react";
import { AuthProvider as CustomAuthProvider } from "@/contexts/auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <CustomAuthProvider>{children}</CustomAuthProvider>;
}