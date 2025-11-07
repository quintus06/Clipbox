import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth-wrapper';
import type { UserRole } from '@/lib/auth-wrapper';
import {
  validateGoogleOAuthEnv,
  getGoogleRedirectUri,
  logValidationResults,
} from '@/lib/env-validation';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables before proceeding
    const validation = validateGoogleOAuthEnv();
    logValidationResults('Google', validation);

    // If validation fails, redirect to signin with error
    if (!validation.isValid) {
      console.error('Google OAuth callback failed due to missing environment variables');
      console.error('Validation errors:', validation.errors);
      
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent(
            'Configuration OAuth manquante. Veuillez contacter le support.'
          ),
          request.url
        )
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/auth/signin?error=${encodeURIComponent('Autorisation Google refusée')}`,
          request.url
        )
      );
    }

    // Verify and decode state parameter
    const storedState = request.cookies.get('google_oauth_state')?.value;
    if (!state || state !== storedState) {
      console.error('OAuth state mismatch:', { received: state, stored: storedState });
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Decode state to extract role and callback URL
    let stateData: { random: string; role: string; callbackUrl: string };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
    } catch (err) {
      console.error('Failed to decode state:', err);
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    const role = stateData.role || 'CLIPPER';
    const callbackUrl = stateData.callbackUrl || '/dashboard';

    // Get code verifier for PKCE
    const codeVerifier = request.cookies.get('google_code_verifier')?.value;
    if (!codeVerifier) {
      console.error('Code verifier missing from cookies');
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('Code verifier manquant'),
          request.url
        )
      );
    }

    if (!code) {
      console.error('Authorization code missing from callback');
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('Code d\'autorisation manquant'),
          request.url
        )
      );
    }

    // Get the redirect URI (must match what was used in authorize)
    const redirectUri = getGoogleRedirectUri();
    
    if (!redirectUri || redirectUri.includes('undefined')) {
      console.error('Failed to construct valid redirect_uri for token exchange:', redirectUri);
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('Erreur de configuration OAuth'),
          request.url
        )
      );
    }

    console.log('=== Google OAuth Callback ===');
    console.log('Exchanging code for token...');
    console.log('Redirect URI:', redirectUri);

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange error:', errorData);
      console.error('Token exchange failed with status:', tokenResponse.status);
      
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful');

    // Get user info from Google
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error('Google user info error, status:', userInfoResponse.status);
      return NextResponse.redirect(
        new URL(
          '/auth/signin?error=' + encodeURIComponent('Échec de récupération des infos utilisateur'),
          request.url
        )
      );
    }

    const googleUser = await userInfoResponse.json();
    console.log('User info retrieved:', googleUser.email);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    let redirectUrl = callbackUrl;

    if (!user) {
      // Create new user with selected role
      const userRole = role === 'ADVERTISER' ? 'ADVERTISER' : 'CLIPPER';
      
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          role: userRole,
          profile: {
            create: {
              notifyEmail: true,
              notifyPush: true,
              publicProfile: true,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      console.log('[Google OAuth] New user created with role:', userRole, 'email:', user.email);
      
      // Redirect based on selected role
      redirectUrl = userRole === 'ADVERTISER' ? '/dashboard/advertiser' : '/dashboard/clipper';
    } else {
      // Update user image if changed
      if (user.image !== googleUser.picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { image: googleUser.picture },
        });
      }

      console.log('[Google OAuth] Existing user logged in:', user.email);
      
      // Determine redirect based on user role
      redirectUrl = getRoleBasedRedirect(user.role);
    }

    // Create JWT token
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      image: user.image,
    };

    const token = createToken(authUser);

    // Clear OAuth cookies and set auth token
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    response.cookies.delete('google_oauth_state');
    response.cookies.delete('google_code_verifier');

    // Set auth token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('[Google OAuth] Authentication successful, redirecting to:', redirectUrl);
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.redirect(
      new URL(
        '/auth/signin?error=' + encodeURIComponent('Erreur lors de la connexion Google'),
        request.url
      )
    );
  }
}

function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'CLIPPER':
      return '/dashboard/clipper';
    case 'ADVERTISER':
      return '/dashboard/advertiser';
    case 'SUPER_ADMIN':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}