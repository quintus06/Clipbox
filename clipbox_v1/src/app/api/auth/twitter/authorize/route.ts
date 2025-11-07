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

    // Generate PKCE parameters (required by Twitter OAuth 2.0)
    const { codeVerifier, codeChallenge } = generatePKCE();

    // Build authorization URL parameters
    const redirectUri = (process.env.NODE_ENV === 'production'
      ? process.env.TWITTER_REDIRECT_URI_PROD!
      : process.env.TWITTER_REDIRECT_URI!).trim();
    
    const authParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.TWITTER_CLIENT_ID!,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${authParams.toString()}`;
    
    // Log the authorization URL for debugging (remove in production)
    console.log('=== Twitter OAuth Debug ===');
    console.log('Full URL:', authUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID:', process.env.TWITTER_CLIENT_ID);
    console.log('========================');

    // Store state and code_verifier in cookies for verification in callback
    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for verification
    response.cookies.set('twitter_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Store PKCE code_verifier for token exchange
    response.cookies.set('twitter_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    // Store user ID for callback
    response.cookies.set('twitter_oauth_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Twitter OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'autorisation Twitter' },
      { status: 500 }
    );
  }
}