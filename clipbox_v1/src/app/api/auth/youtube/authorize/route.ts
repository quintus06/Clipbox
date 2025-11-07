import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { generateOAuthState, generatePKCE } from '@/lib/oauth-utils';
import {
  validateYouTubeOAuthEnv,
  getYouTubeRedirectUri,
  logValidationResults,
  createEnvErrorResponse,
} from '@/lib/env-validation';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables before proceeding
    const validation = validateYouTubeOAuthEnv();
    logValidationResults('YouTube', validation);

    // If validation fails, return error response
    if (!validation.isValid) {
      console.error('YouTube OAuth authorization failed due to missing environment variables');
      const errorResponse = createEnvErrorResponse(validation);
      
      return NextResponse.json(
        {
          error: errorResponse.error,
          details: errorResponse.details,
          documentation: errorResponse.documentation,
        },
        { status: 500 }
      );
    }

    // Get the redirect URI
    const redirectUri = getYouTubeRedirectUri();
    
    // Double-check redirect URI is valid (should not happen if validation passed)
    if (!redirectUri || redirectUri.includes('undefined')) {
      console.error('Failed to construct valid redirect_uri:', redirectUri);
      return NextResponse.json(
        {
          error: 'OAuth configuration error',
          details: [
            'Unable to construct a valid redirect URI. Please check your NEXTAUTH_URL environment variable.',
          ],
          documentation: 'See VERCEL_ENV_VARIABLES.md for setup instructions.',
        },
        { status: 500 }
      );
    }

    // DIAGNOSTIC LOGGING
    console.log('=== YouTube OAuth Authorize ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID configured:', !!process.env.YOUTUBE_CLIENT_ID);

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
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl',
        state,
        access_type: 'offline', // Request refresh token
        prompt: 'consent', // Force consent screen to get refresh token
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      }).toString();

    console.log('Redirecting to YouTube OAuth...');

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
    
    // Return JSON error for API errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'OAuth authorization failed',
          details: [error.message],
          documentation: 'See VERCEL_ENV_VARIABLES.md for setup instructions.',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'autorisation YouTube' },
      { status: 500 }
    );
  }
}