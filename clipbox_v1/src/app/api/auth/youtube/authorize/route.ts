import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { generateOAuthState, generatePKCE } from '@/lib/oauth-utils';

export async function GET(request: NextRequest) {
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

    // Generate state parameter for CSRF protection
    const state = generateOAuthState();
    
    // Generate PKCE parameters for enhanced security
    const { codeVerifier, codeChallenge } = generatePKCE();

    // YouTube OAuth URL (uses Google OAuth)
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        redirect_uri: process.env.NODE_ENV === 'production'
          ? process.env.YOUTUBE_REDIRECT_URI_PROD!
          : process.env.YOUTUBE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl',
        state,
        access_type: 'offline', // Request refresh token
        prompt: 'consent', // Force consent screen to get refresh token
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      }).toString();

    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for verification
    response.cookies.set('youtube_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Store code verifier for PKCE
    response.cookies.set('youtube_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    // Store user ID for callback
    response.cookies.set('youtube_oauth_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('YouTube OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'autorisation YouTube' },
      { status: 500 }
    );
  }
}