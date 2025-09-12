// src/types/auth.ts

import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  emailVerified?: Date | null;
  profile?: {
    id: string;
    bio?: string | null;
    company?: string | null;
    totalEarnings?: number;
    totalClips?: number;
    averageRating?: number;
  } | null;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface AuthError {
  error: string;
  message?: string;
}

export type AuthProvider = 'google' | 'credentials';

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  siret?: string;
}