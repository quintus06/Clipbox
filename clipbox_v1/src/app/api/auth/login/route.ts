// src/app/api/auth/login/route.ts
// Endpoint de connexion principal

import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createToken } from "@/lib/auth-wrapper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[Login] Attempting login for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      console.log("[Login] Authentication failed");
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    console.log("[Login] Authentication successful for user:", user.email, "Role:", user.role);
    
    // Créer un token JWT
    const token = createToken(user);

    // Déterminer l'URL de redirection basée sur le rôle
    const redirectUrl = getRoleBasedRedirect(user.role);
    console.log("[Login] Redirect URL for role", user.role, ":", redirectUrl);

    // Créer la réponse avec le cookie de session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      message: "Connexion réussie",
      redirectUrl: redirectUrl,
    });

    // Définir le cookie de session
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });

    console.log("[Login] Response prepared with cookie and redirect URL");
    return response;
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
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