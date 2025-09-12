// src/app/api/auth/me/route.ts
// Endpoint pour récupérer l'utilisateur courant

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth-wrapper";

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier le token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }

    // Récupérer les données fraîches de l'utilisateur depuis la DB
    const user = await getUserById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("[Me] Error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}