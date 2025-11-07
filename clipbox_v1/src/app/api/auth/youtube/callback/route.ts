import { NextRequest, NextResponse } from 'next/server';
import { storeOAuthTokens } from '@/lib/oauth-utils';
import { Platform } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
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
        redirect_uri: process.env.NODE_ENV === 'production'
          ? process.env.YOUTUBE_REDIRECT_URI_PROD!
          : process.env.YOUTUBE_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('YouTube token exchange error:', errorData);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();

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
      console.error('YouTube channel info error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos YouTube'),
          request.url
        )
      );
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
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
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion YouTube'),
        request.url
      )
    );
  }
}