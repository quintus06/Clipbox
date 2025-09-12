// src/app/api/auth/refresh/route.ts
// Endpoint pour rafraîchir le token d'authentification

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, createToken } from "@/lib/auth-wrapper";

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token actuel depuis les cookies
    const currentToken = request.cookies.get("auth-token")?.value;

    if (!currentToken) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier le token actuel
    const decoded = verifyToken(currentToken);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }

    // Récupérer les données fraîches de l'utilisateur
    const user = await getUserById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Créer un nouveau token
    const newToken = createToken(user);

    // Créer la réponse avec le nouveau token
    const response = NextResponse.json({
      success: true,
      message: "Token rafraîchi avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });

    // Mettre à jour le cookie avec le nouveau token
    response.cookies.set("auth-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });

    console.log("[Refresh] Token refreshed for user:", user.email);
    return response;
  } catch (error) {
    console.error("[Refresh] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors du rafraîchissement du token" },
      { status: 500 }
    );
  }
}