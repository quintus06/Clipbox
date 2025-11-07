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
      console.error('Instagram OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/dashboard/clipper/settings?error=${encodeURIComponent('Autorisation Instagram refusée')}`,
          request.url
        )
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('instagram_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('État OAuth invalide'),
          request.url
        )
      );
    }

    // Get user ID from cookie
    const userId = request.cookies.get('instagram_oauth_user')?.value;
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
          ? process.env.INSTAGRAM_REDIRECT_URI_PROD!
          : process.env.INSTAGRAM_REDIRECT_URI!,
        code,
      })
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Instagram token exchange error:', errorData);
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de l\'échange de token'),
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();

    // Get Facebook pages (needed to access Instagram Business accounts)
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
    );

    if (!pagesResponse.ok) {
      console.error('Instagram pages error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des pages'),
          request.url
        )
      );
    }

    const pagesData = await pagesResponse.json();

    // Get Instagram Business Account from the first page
    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Aucune page Facebook trouvée. Connectez d\'abord votre compte Instagram à une page Facebook.'),
          request.url
        )
      );
    }

    const pageId = pagesData.data[0].id;
    const pageAccessToken = pagesData.data[0].access_token;

    // Get Instagram Business Account ID
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );

    if (!igAccountResponse.ok) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Aucun compte Instagram Business trouvé. Assurez-vous que votre compte Instagram est connecté à votre page Facebook.'),
          request.url
        )
      );
    }

    const igAccountData = await igAccountResponse.json();

    if (!igAccountData.instagram_business_account) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Aucun compte Instagram Business trouvé'),
          request.url
        )
      );
    }

    const igUserId = igAccountData.instagram_business_account.id;

    // Get Instagram user info
    const igUserResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}?fields=id,username,profile_picture_url,followers_count&access_token=${pageAccessToken}`
    );

    if (!igUserResponse.ok) {
      console.error('Instagram user info error');
      return NextResponse.redirect(
        new URL(
          '/dashboard/clipper/settings?error=' + encodeURIComponent('Échec de récupération des infos Instagram'),
          request.url
        )
      );
    }

    const igUserInfo = await igUserResponse.json();

    // Store tokens in database
    await storeOAuthTokens({
      userId,
      platform: Platform.INSTAGRAM_REELS,
      accountId: igUserInfo.id,
      username: igUserInfo.username,
      profileUrl: `https://www.instagram.com/${igUserInfo.username}`,
      accessToken: pageAccessToken, // Use page access token for Instagram API calls
      expiresIn: tokenData.expires_in,
      followers: igUserInfo.followers_count || 0,
    });

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      new URL('/dashboard/clipper/settings?success=instagram', request.url)
    );
    
    response.cookies.delete('instagram_oauth_state');
    response.cookies.delete('instagram_oauth_user');

    return response;
  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        '/dashboard/clipper/settings?error=' + encodeURIComponent('Erreur lors de la connexion Instagram'),
        request.url
      )
    );
  }
}