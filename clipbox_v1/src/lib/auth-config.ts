// src/lib/auth-config.ts
// DEPRECATED: NextAuth has been replaced with a custom JWT authentication system
// 
// This file is no longer used and is kept for reference only.
// The new authentication system uses:
// - JWT tokens stored in HTTP-only cookies
// - Custom authentication endpoints in /api/auth/*
// - AuthContext for client-side state management
//
// See the following files for the new implementation:
// - src/contexts/auth-context.tsx - Client-side authentication context
// - src/hooks/use-auth.ts - Authentication hook
// - src/api/auth/login/route.ts - Login endpoint
// - src/api/auth/register/route.ts - Registration endpoint
// - src/api/auth/me/route.ts - Get current user endpoint
// - src/api/auth/refresh/route.ts - Token refresh endpoint
// - src/api/auth/logout/route.ts - Logout endpoint

export const authConfig = {
  deprecated: true,
  message: "This configuration is no longer used. Please use the custom JWT authentication system."
};