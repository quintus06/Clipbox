// src/types/next-auth.d.ts
// DEPRECATED: NextAuth has been replaced with a custom JWT authentication system
//
// These type definitions are no longer used.
// The new authentication system uses custom types defined in:
// - src/contexts/auth-context.tsx (AuthUser, UserRole types)
// - src/types/auth.ts (if additional auth types are needed)
//
// The custom authentication system provides:
// - AuthUser interface with id, email, name, role, and image
// - UserRole type: "CLIPPER" | "ADVERTISER" | "SUPER_ADMIN"
// - No dependency on NextAuth types

// This file is kept to prevent TypeScript errors in case of any lingering references
// but should not be used for new development