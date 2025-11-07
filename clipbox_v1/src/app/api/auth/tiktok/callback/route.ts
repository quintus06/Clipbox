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
    console.log('TikTok callback - All params:', Object.fromEntries(searchParams.entries()));

    // Check for OAuth errors
    if (error) {
      console.error('TikTok OAuth error:', error);
      console.error('TikTok OAuth error description:', errorDescription);
      return NextResponse.redirect(
        new URL(
          `/dashboard/clipper/settings?error=${encodeURIComponent('Autorisation TikTok refusée')}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('tiktok_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Get user ID from cookie
    const userId = request.cookies.get('tiktok_oauth_user')?.value;
    if (!userId) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Session expirée'),
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

    // Exchange code for access token (TikTok does NOT use PKCE)
    const tokenParams = {
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NODE_ENV === 'production'
        ? process.env.TIKTOK_REDIRECT_URI_PROD!
        : process.env.TIKTOK_REDIRECT_URI!,
    };

    console.log('TikTok token exchange params (without secrets):', {
      ...tokenParams,
      client_secret: '[REDACTED]',
    });

    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('TikTok token exchange error:', errorData);
      console.error('TikTok token exchange status:', tokenResponse.status);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info from TikTok
    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,username', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('TikTok user info error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos utilisateur'),
          request.url
        )
      );
    }

    const userInfo = await userInfoResponse.json();
    const userData = userInfo.data.user;

    // Store tokens in database
    await storeOAuthTokens({
      userId,
      platform: Platform.TIKTOK,
      accountId: userData.open_id,
      username: userData.username || userData.display_name,
      profileUrl: `https://www.tiktok.com/@${userData.username || userData.display_name}`,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      followers: userData.follower_count || 0,
    });

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL('/dashboard/clipper/settings?success=tiktok', request.url)
    );
    
    response.cookies.delete('tiktok_oauth_state');
    response.cookies.delete('tiktok_oauth_user');

    return response;
  } catch (error) {
    console.error('TikTok OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion TikTok'),
        request.url
      )
    );
  }
}