import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { generateOAuthState } from '@/lib/oauth-utils';

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

    // Instagram uses Facebook OAuth with Instagram-specific scopes
    const authUrl = 'https://www.facebook.com/v18.0/dialog/oauth?' +
      new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        redirect_uri: process.env.NODE_ENV === 'production'
          ? process.env.INSTAGRAM_REDIRECT_URI_PROD!
          : process.env.INSTAGRAM_REDIRECT_URI!,
        state,
        scope: 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement',
        response_type: 'code',
      }).toString();

    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for verification
    response.cookies.set('instagram_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Store user ID for callback
    response.cookies.set('instagram_oauth_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Instagram OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'autorisation Instagram' },
      { status: 500 }
    );
  }
}