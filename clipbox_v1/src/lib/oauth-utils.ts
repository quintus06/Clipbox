import { prisma } from './prisma';
import { Platform } from '@prisma/client';
import crypto from 'crypto';

/**
 * Generate a secure random state parameter for OAuth flow
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate PKCE code verifier and challenge
 */
export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  
  return { codeVerifier, codeChallenge };
}

/**
 * Store OAuth tokens in database
 */
export async function storeOAuthTokens(params: {
  userId: string;
  platform: Platform;
  accountId: string;
  username: string;
  profileUrl: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  followers?: number;
}) {
  const {
    userId,
    platform,
    accountId,
    username,
    profileUrl,
    accessToken,
    refreshToken,
    expiresIn,
    followers = 0,
  } = params;

  const tokenExpiry = expiresIn
    ? new Date(Date.now() + expiresIn * 1000)
    : null;

  return await prisma.socialAccount.upsert({
    where: {
      platform_accountId: {
        platform,
        accountId,
      },
    },
    update: {
      username,
      profileUrl,
      accessToken,
      refreshToken,
      tokenExpiry,
      followers,
      lastSync: new Date(),
      updatedAt: new Date(),
    },
    create: {
      userId,
      platform,
      accountId,
      username,
      profileUrl,
      accessToken,
      refreshToken,
      tokenExpiry,
      followers,
      lastSync: new Date(),
    },
  });
}

/**
 * Get OAuth tokens for a user and platform
 */
export async function getOAuthTokens(userId: string, platform: Platform) {
  return await prisma.socialAccount.findFirst({
    where: {
      userId,
      platform,
    },
  });
}

/**
 * Check if token is expired
 */
export function isTokenExpired(tokenExpiry: Date | null): boolean {
  if (!tokenExpiry) return false;
  return new Date() >= tokenExpiry;
}

/**
 * Refresh TikTok access token
 */
export async function refreshTikTokToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh TikTok token');
  }

  return await response.json();
}

/**
 * Refresh YouTube access token
 */
export async function refreshYouTubeToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh YouTube token');
  }

  return await response.json();
}
/**
 * Refresh Twitter access token
 */
export async function refreshTwitterToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  // Twitter OAuth 2.0 requires Basic Auth with client_id:client_secret
  const basicAuth = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Twitter token');
  }

  return await response.json();
}


/**
 * Refresh Facebook/Instagram access token
 */
export async function refreshFacebookToken(accessToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      fb_exchange_token: accessToken,
    })
  );

  if (!response.ok) {
    throw new Error('Failed to refresh Facebook token');
  }

  return await response.json();
}

/**
 * Revoke OAuth token
 */
export async function revokeOAuthToken(
  platform: Platform,
  token: string
): Promise<boolean> {
  try {
    switch (platform) {
      case Platform.TIKTOK:
        await fetch('https://open.tiktokapis.com/v2/oauth/revoke/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_key: process.env.TIKTOK_CLIENT_KEY!,
            client_secret: process.env.TIKTOK_CLIENT_SECRET!,
            token,
          }),
        });
        break;

      case Platform.YOUTUBE:
        await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ token }),
        });
        break;

      case Platform.TWITTER:
        // Twitter OAuth 2.0 requires Basic Auth for token revocation
        const basicAuth = Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64');
        
        await fetch('https://api.twitter.com/2/oauth2/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: new URLSearchParams({
            token,
            token_type_hint: 'access_token',
          }),
        });
        break;

      case Platform.FACEBOOK:
      case Platform.INSTAGRAM:
        // Facebook doesn't have a revoke endpoint, we just delete from our DB
        break;
    }
    return true;
  } catch (error) {
    console.error('Error revoking token:', error);
    return false;
  }
}

/**
 * Delete social account connection
 */
export async function disconnectSocialAccount(
  userId: string,
  platform: Platform
): Promise<boolean> {
  try {
    // Get the account to revoke token
    const account = await getOAuthTokens(userId, platform);
    
    if (account?.accessToken) {
      await revokeOAuthToken(platform, account.accessToken);
    }

    // Delete from database
    await prisma.socialAccount.deleteMany({
      where: {
        userId,
        platform,
      },
    });

    return true;
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    return false;
  }
}

/**
 * Get valid access token (refresh if expired)
 */
export async function getValidAccessToken(
  userId: string,
  platform: Platform
): Promise<string | null> {
  const account = await getOAuthTokens(userId, platform);
  
  if (!account) return null;

  // If token is not expired, return it
  if (!isTokenExpired(account.tokenExpiry)) {
    return account.accessToken;
  }

  // Token is expired, try to refresh
  if (!account.refreshToken) {
    return null;
  }

  try {
    let newTokenData;
    
    switch (platform) {
      case Platform.TIKTOK:
        newTokenData = await refreshTikTokToken(account.refreshToken);
        await storeOAuthTokens({
          userId,
          platform,
          accountId: account.accountId,
          username: account.username,
          profileUrl: account.profileUrl,
          accessToken: newTokenData.access_token,
          refreshToken: newTokenData.refresh_token,
          expiresIn: newTokenData.expires_in,
        });
        return newTokenData.access_token;

      case Platform.YOUTUBE:
        newTokenData = await refreshYouTubeToken(account.refreshToken);
        await storeOAuthTokens({
          userId,
          platform,
          accountId: account.accountId,
          username: account.username,
          profileUrl: account.profileUrl,
          accessToken: newTokenData.access_token,
          refreshToken: account.refreshToken, // YouTube doesn't return new refresh token
          expiresIn: newTokenData.expires_in,
        });
        return newTokenData.access_token;

      case Platform.TWITTER:
        newTokenData = await refreshTwitterToken(account.refreshToken);
        await storeOAuthTokens({
          userId,
          platform,
          accountId: account.accountId,
          username: account.username,
          profileUrl: account.profileUrl,
          accessToken: newTokenData.access_token,
          refreshToken: newTokenData.refresh_token,
          expiresIn: newTokenData.expires_in,
        });
        return newTokenData.access_token;

      case Platform.FACEBOOK:
      case Platform.INSTAGRAM:
        if (account.accessToken) {
          newTokenData = await refreshFacebookToken(account.accessToken);
          await storeOAuthTokens({
            userId,
            platform,
            accountId: account.accountId,
            username: account.username,
            profileUrl: account.profileUrl,
            accessToken: newTokenData.access_token,
            expiresIn: newTokenData.expires_in,
          });
          return newTokenData.access_token;
        }
        return null;

      default:
        return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}