// src/app/api/auth/register/route.ts
// Endpoint d'inscription avec auto-connexion

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth-wrapper";
import type { UserRole } from "@/lib/auth-wrapper";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CLIPPER", "ADVERTISER"]),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    console.log("[Register] Attempting registration for:", validatedData.email);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create user with profile and balance (for advertisers) in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          password: hashedPassword,
          role: validatedData.role as any,
          profile: {
            create: {
              company: validatedData.company,
              notifyEmail: true,
              notifyPush: true,
              publicProfile: true,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Create Balance record for ADVERTISER users with 3500 EUR starting balance
      if (validatedData.role === 'ADVERTISER') {
        await tx.balance.create({
          data: {
            userId: newUser.id,
            currency: 'EUR',
            available: 3500,
            pending: 0,
          },
        });
        console.log('[Register] Balance initialized for advertiser:', newUser.email, 'with 3500 EUR');
      }

      return newUser;
    });
    
    console.log("[Register] User created successfully:", user.email);
    
    // Créer automatiquement un token pour connecter l'utilisateur
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      image: user.image,
    };
    
    const token = createToken(authUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Créer la réponse avec le cookie de session
    const response = NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        user: userWithoutPassword,
        redirectUrl: getRoleBasedRedirect(user.role),
      },
      { status: 201 }
    );
    
    // Définir le cookie de session pour auto-connexion
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("[Register] Error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du compte" },
      { status: 500 }
    );
  }
}

function getRoleBasedRedirect(role: string): string {
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