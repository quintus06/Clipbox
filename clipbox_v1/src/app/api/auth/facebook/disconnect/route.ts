import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { disconnectSocialAccount } from '@/lib/oauth-utils';
import { Platform } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Disconnect Facebook account
    const success = await disconnectSocialAccount(user.id, Platform.FACEBOOK);

    if (!success) {
      return NextResponse.json(
        { error: 'Échec de la déconnexion du compte Facebook' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Compte Facebook déconnecté avec succès',
    });
  } catch (error) {
    console.error('Facebook disconnect error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion Facebook' },
      { status: 500 }
    );
  }
}