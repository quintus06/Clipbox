// src/app/api/auth/test-login/route.ts
// Endpoint temporaire pour tester l'authentification

import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createToken } from "@/lib/auth-wrapper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[Test Login] Attempting login for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      console.log("[Test Login] Authentication failed");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("[Test Login] Authentication successful for user:", user.email);
    
    // Créer un token JWT
    const token = createToken(user);

    // Créer la réponse avec le cookie de session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Authentication successful! Redirecting to dashboard...",
      redirectUrl: getRoleBasedRedirect(user.role),
    });

    // Définir le cookie de session
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Test Login] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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