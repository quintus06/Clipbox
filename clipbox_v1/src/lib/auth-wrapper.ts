// src/lib/auth-wrapper.ts
// Wrapper pour contourner les problèmes de compatibilité NextAuth v5 + Next.js 15

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "clipbox-nextauth-secret-2024-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

export type UserRole = "CLIPPER" | "ADVERTISER" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

/**
 * Authentifie un utilisateur avec email/mot de passe
 */
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    console.log("[Auth Wrapper] Attempting authentication for:", email);
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.password) {
      console.log("[Auth Wrapper] User not found or no password set");
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("[Auth Wrapper] Invalid password");
      return null;
    }

    console.log("[Auth Wrapper] Authentication successful");
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      image: user.image,
    };
  } catch (error) {
    console.error("[Auth Wrapper] Authentication error:", error);
    return null;
  }
}

/**
 * Crée un token JWT pour l'utilisateur
 */
export function createToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

/**
 * Vérifie et décode un token JWT (compatible Edge Runtime)
 */
export async function verifyTokenEdge(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string | null,
      role: payload.role as UserRole,
      image: null,
    };
  } catch (error) {
    console.error("[Auth Wrapper] Token verification error:", error);
    return null;
  }
}

/**
 * Vérifie et décode un token JWT (version synchrone pour compatibilité)
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      image: null,
    };
  } catch (error) {
    console.error("[Auth Wrapper] Token verification error:", error);
    return null;
  }
}

/**
 * Récupère l'utilisateur depuis la base de données
 */
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      image: user.image,
    };
  } catch (error) {
    console.error("[Auth Wrapper] Get user error:", error);
    return null;
  }
}