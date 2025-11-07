import { NextRequest, NextResponse } from 'next/server';
import { storeOAuthTokens } from '@/lib/oauth-utils';
import { Platform } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Log all query parameters for debugging
    console.log('Twitter callback - All params:', Object.fromEntries(searchParams.entries()));

    // Check for OAuth errors
    if (error) {
      console.error('Twitter OAuth error:', error);
      console.error('Twitter OAuth error description:', errorDescription);
      return NextResponse.redirect(
        new URL(
          `/dashboard/clipper/settings?error=${encodeURIComponent('Autorisation Twitter refusée')}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('twitter_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Get user ID from cookie
    const userId = request.cookies.get('twitter_oauth_user')?.value;
    if (!userId) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Session expirée'),
          request.url
        )
      );
    }

    // Get PKCE code_verifier from cookie
    const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;
    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Code verifier manquant'),
          request.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Code d\'autorisation manquant'),
          request.url
        )
      );
    }

    // Exchange code for access token using PKCE
    const redirectUri = (process.env.NODE_ENV === 'production'
      ? process.env.TWITTER_REDIRECT_URI_PROD!
      : process.env.TWITTER_REDIRECT_URI!).trim();
    
    const tokenParams = {
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID!,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    };

    console.log('Twitter token exchange params (without secrets):', {
      ...tokenParams,
      code_verifier: '[REDACTED]',
    });

    // Twitter OAuth 2.0 requires Basic Auth with client_id:client_secret
    const basicAuth = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Twitter token exchange error:', errorData);
      console.error('Twitter token exchange status:', tokenResponse.status);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Twitter API v2
    const userInfoResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics,username', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Twitter user info error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos utilisateur'),
          request.url
        )
      );
    }

    const userInfo = await userInfoResponse.json();
    const userData = userInfo.data;

    // Store tokens in database
    await storeOAuthTokens({
      userId,
      platform: Platform.TWITTER,
      accountId: userData.id,
      username: userData.username,
      profileUrl: `https://twitter.com/${userData.username}`,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      followers: userData.public_metrics?.followers_count || 0,
    });

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL('/dashboard/clipper/settings?success=twitter', request.url)
    );
    
    response.cookies.delete('twitter_oauth_state');
    response.cookies.delete('twitter_oauth_user');
    response.cookies.delete('twitter_code_verifier');

    return response;
  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion Twitter'),
        request.url
      )
    );
  }
}