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
      console.error('Facebook OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/dashboard/clipper/settings?error=${encodeURIComponent('Autorisation Facebook refusée')}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('facebook_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Get user ID from cookie
    const userId = request.cookies.get('facebook_oauth_user')?.value;
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

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://graph.facebook.com/v18.0/oauth/access_token?' +
      new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: process.env.NODE_ENV === 'production'
          ? process.env.FACEBOOK_REDIRECT_URI_PROD!
          : process.env.FACEBOOK_REDIRECT_URI!,
        code,
      })
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Facebook token exchange error:', errorData);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Facebook
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,picture&access_token=${tokenData.access_token}`
    );

    if (!userInfoResponse.ok) {
      console.error('Facebook user info error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos utilisateur'),
          request.url
        )
      );
    }

    const userInfo = await userInfoResponse.json();

    // Store tokens in database
    await storeOAuthTokens({
      userId,
      platform: Platform.FACEBOOK,
      accountId: userInfo.id,
      username: userInfo.name,
      profileUrl: `https://www.facebook.com/${userInfo.id}`,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      followers: 0, // Facebook doesn't provide follower count in basic info
    });

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL('/dashboard/clipper/settings?success=facebook', request.url)
    );
    
    response.cookies.delete('facebook_oauth_state');
    response.cookies.delete('facebook_oauth_user');

    return response;
  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion Facebook'),
        request.url
      )
    );
  }
}