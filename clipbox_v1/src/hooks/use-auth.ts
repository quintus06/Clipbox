// src/hooks/use-auth.ts
// Hook d'authentification personnalisé

"use client";

import { useAuth as useAuthContext } from "@/contexts/auth-context";

// Réexporter le hook du contexte pour une utilisation simplifiée
export { useAuth } from "@/contexts/auth-context";

// Export des types pour compatibilité
export type { UserRole, AuthUser } from "@/contexts/auth-context";