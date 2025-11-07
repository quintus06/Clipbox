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

    // Disconnect TikTok account
    const success = await disconnectSocialAccount(user.id, Platform.TIKTOK);

    if (!success) {
      return NextResponse.json(
        { error: 'Échec de la déconnexion du compte TikTok' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Compte TikTok déconnecté avec succès',
    });
  } catch (error) {
    console.error('TikTok disconnect error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion TikTok' },
      { status: 500 }
    );
  }
}