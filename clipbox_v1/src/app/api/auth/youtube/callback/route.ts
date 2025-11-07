import { NextRequest, NextResponse } from 'next/server';
import { storeOAuthTokens } from '@/lib/oauth-utils';
import { Platform } from '@prisma/client';
import {
  validateYouTubeOAuthEnv,
  getYouTubeRedirectUri,
  logValidationResults,
} from '@/lib/env-validation';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables before proceeding
    const validation = validateYouTubeOAuthEnv();
    logValidationResults('YouTube', validation);

    // If validation fails, redirect to settings with error
    if (!validation.isValid) {
      console.error('YouTube OAuth callback failed due to missing environment variables');
      console.error('Validation errors:', validation.errors);
      
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent(
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
      console.error('YouTube OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/dashboard/clipper/settings?error=${encodeURIComponent('Autorisation YouTube refusée')}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('youtube_oauth_state')?.value;
    if (!state || state !== storedState) {
      console.error('OAuth state mismatch:', { received: state, stored: storedState });
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Get user ID from cookie
    const userId = request.cookies.get('youtube_oauth_user')?.value;
    if (!userId) {
      console.error('User ID missing from cookies');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Session expirée'),
          request.url
        )
      );
    }

    // Get code verifier for PKCE
    const codeVerifier = request.cookies.get('youtube_code_verifier')?.value;
    if (!codeVerifier) {
      console.error('Code verifier missing from cookies');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Code verifier manquant'),
          request.url
        )
      );
    }

    if (!code) {
      console.error('Authorization code missing from callback');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Code d\'autorisation manquant'),
          request.url
        )
      );
    }

    // Get the redirect URI (must match what was used in authorize)
    const redirectUri = getYouTubeRedirectUri();
    
    if (!redirectUri || redirectUri.includes('undefined')) {
      console.error('Failed to construct valid redirect_uri for token exchange:', redirectUri);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur de configuration OAuth'),
          request.url
        )
      );
    }

    console.log('=== YouTube OAuth Callback ===');
    console.log('Exchanging code for token...');
    console.log('Redirect URI:', redirectUri);

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('YouTube token exchange error:', errorData);
      console.error('Token exchange failed with status:', tokenResponse.status);
      
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful');

    // Get YouTube channel info
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!channelResponse.ok) {
      console.error('YouTube channel info error, status:', channelResponse.status);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos YouTube'),
          request.url
        )
      );
    }

    const channelData = await channelResponse.json();
    console.log('Channel info retrieved');

    if (!channelData.items || channelData.items.length === 0) {
      console.error('No YouTube channel found for user');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Aucune chaîne YouTube trouvée'),
          request.url
        )
      );
    }

    const channel = channelData.items[0];

    // Store tokens in database
    await storeOAuthTokens({
      userId,
      platform: Platform.YOUTUBE_SHORTS,
      accountId: channel.id,
      username: channel.snippet.title,
      profileUrl: `https://www.youtube.com/channel/${channel.id}`,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      followers: parseInt(channel.statistics.subscriberCount) || 0,
    });

    console.log('[YouTube OAuth] Channel connected successfully:', channel.snippet.title);

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL('/dashboard/clipper/settings?success=youtube', request.url)
    );
    
    response.cookies.delete('youtube_oauth_state');
    response.cookies.delete('youtube_oauth_user');
    response.cookies.delete('youtube_code_verifier');

    return response;
  } catch (error) {
    console.error('YouTube OAuth callback error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion YouTube'),
        request.url
      )
    );
  }
}