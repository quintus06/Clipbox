import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-wrapper';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
  url: string;
}

/**
 * GET /api/youtube/videos
 * Fetches recent videos from the user's YouTube channel
 * Query params:
 *   - accountId: The social account ID to fetch videos for
 *   - maxResults: Maximum number of videos to return (default: 10)
 */
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

    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId est requis' },
        { status: 400 }
      );
    }

    // Get the social account from database
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
        platform: 'YOUTUBE_SHORTS',
      },
    });

    if (!socialAccount) {
      return NextResponse.json(
        { error: 'Compte YouTube non trouvé' },
        { status: 404 }
      );
    }

    // Check if access token exists
    if (!socialAccount.accessToken) {
      return NextResponse.json(
        { error: 'Token d\'accès manquant. Veuillez reconnecter votre compte YouTube.' },
        { status: 401 }
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = socialAccount.accessToken;
    if (socialAccount.tokenExpiry && new Date(socialAccount.tokenExpiry) < new Date()) {
      console.log('Access token expired, refreshing...');
      
      if (!socialAccount.refreshToken) {
        return NextResponse.json(
          { error: 'Token expiré. Veuillez reconnecter votre compte YouTube.' },
          { status: 401 }
        );
      }

      // Refresh the token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.YOUTUBE_CLIENT_ID!,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
          refresh_token: socialAccount.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        console.error('Token refresh failed:', await refreshResponse.text());
        return NextResponse.json(
          { error: 'Échec du rafraîchissement du token. Veuillez reconnecter votre compte.' },
          { status: 401 }
        );
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Update token in database
      await prisma.socialAccount.update({
        where: { id: accountId },
        data: {
          accessToken: refreshData.access_token,
          tokenExpiry: new Date(Date.now() + refreshData.expires_in * 1000),
        },
      });

      console.log('Token refreshed successfully');
    }

    // Fetch videos from YouTube Data API v3
    // Using search endpoint to get user's videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('forMine', 'true');
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('maxResults', maxResults.toString());
    searchUrl.searchParams.append('order', 'date');

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('YouTube API error:', errorText);
      
      // Check for quota exceeded error
      if (searchResponse.status === 403) {
        return NextResponse.json(
          { error: 'Quota API YouTube dépassé. Veuillez réessayer plus tard.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Échec de récupération des vidéos YouTube' },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return NextResponse.json({
        videos: [],
        message: 'Aucune vidéo trouvée',
      });
    }

    // Get video IDs to fetch additional details (views, duration)
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Fetch video details including statistics and content details
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.append('part', 'snippet,statistics,contentDetails');
    videosUrl.searchParams.append('id', videoIds);

    const videosResponse = await fetch(videosUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!videosResponse.ok) {
      console.error('YouTube videos API error:', await videosResponse.text());
      return NextResponse.json(
        { error: 'Échec de récupération des détails des vidéos' },
        { status: videosResponse.status }
      );
    }

    const videosData = await videosResponse.json();

    // Format video data
    const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
      // Parse ISO 8601 duration (PT1M30S -> 1:30)
      const duration = parseDuration(item.contentDetails.duration);
      
      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        duration,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      };
    });

    // Update last sync time
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: { lastSync: new Date() },
    });

    return NextResponse.json({
      videos,
      accountUsername: socialAccount.username,
    });

  } catch (error) {
    console.error('YouTube videos API error:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des vidéos' },
      { status: 500 }
    );
  }
}

/**
 * Parse ISO 8601 duration format (PT1M30S) to readable format (1:30)
 */
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}