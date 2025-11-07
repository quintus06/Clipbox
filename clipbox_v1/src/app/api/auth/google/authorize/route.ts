import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthState, generatePKCE } from '@/lib/oauth-utils';
import {
  validateGoogleOAuthEnv,
  getGoogleRedirectUri,
  logValidationResults,
  createEnvErrorResponse,
} from '@/lib/env-validation';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables before proceeding
    const validation = validateGoogleOAuthEnv();
    logValidationResults('Google', validation);

    // If validation fails, return error response
    if (!validation.isValid) {
      console.error('Google OAuth authorization failed due to missing environment variables');
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
    const redirectUri = getGoogleRedirectUri();
    
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
    console.log('=== Google OAuth Authorize ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID configured:', !!process.env.GOOGLE_CLIENT_ID);

    // Generate state parameter for CSRF protection
    const state = generateOAuthState();
    
    // Generate PKCE parameters for enhanced security
    const { codeVerifier, codeChallenge } = generatePKCE();

    // Get the callback URL parameter (where to redirect after successful auth)
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    // Construct Google OAuth URL
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'offline',
        prompt: 'consent',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      }).toString();

    console.log('Redirecting to Google OAuth...');

    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for verification
    response.cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Store code verifier for PKCE
    response.cookies.set('google_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    // Store callback URL for after authentication
    response.cookies.set('google_callback_url', callbackUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google OAuth authorize error:', error);
    
    // Return JSON error for API errors, redirect for user-facing errors
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
    
    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_error', request.url)
    );
  }
}