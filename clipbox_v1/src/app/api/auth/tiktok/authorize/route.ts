import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { generateOAuthState } from '@/lib/oauth-utils';

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

    // Build authorization URL parameters (TikTok does NOT support PKCE)
    // Parameter order matters for some OAuth providers
    const redirectUri = process.env.NODE_ENV === 'production'
      ? process.env.TIKTOK_REDIRECT_URI_PROD!
      : process.env.TIKTOK_REDIRECT_URI!;
    
    const authParams = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      response_type: 'code',
      scope: 'user.info.basic,video.list',
      redirect_uri: redirectUri,
      state,
    });

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${authParams.toString()}`;
    
    // Log the authorization URL for debugging (remove in production)
    console.log('=== TikTok OAuth Debug ===');
    console.log('Full URL:', authUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Client Key:', process.env.TIKTOK_CLIENT_KEY);
    console.log('========================');

    // Store state in session/cookie for verification in callback
    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for verification
    response.cookies.set('tiktok_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Store user ID for callback
    response.cookies.set('tiktok_oauth_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('TikTok OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'autorisation TikTok' },
      { status: 500 }
    );
  }
}