// src/app/api/auth/logout/route.ts
// Endpoint de déconnexion

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[Logout] Processing logout request");

    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });

    // Supprimer le cookie d'authentification
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immédiatement
      path: "/",
    });

    console.log("[Logout] User logged out successfully");
    return response;
  } catch (error) {
    console.error("[Logout] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}

// GET method for easy logout via link
export async function GET(request: NextRequest) {
  return POST(request);
}