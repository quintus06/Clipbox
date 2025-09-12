// src/lib/auth.ts
// Utility functions for authentication

type UserRole = "CLIPPER" | "ADVERTISER" | "SUPER_ADMIN";

/**
 * Get redirect URL based on user role
 */
export function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case "CLIPPER":
      return "/dashboard/clipper";
    case "ADVERTISER":
      return "/dashboard/advertiser";
    case "SUPER_ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}