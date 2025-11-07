import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Example clippers data to use when no real production users exist
const exampleClippers = [
  {
    id: 'example-1',
    name: 'Marie Dubois',
    username: 'marie_creative',
    avatar: null,
    totalViews: 487500,
    totalClips: 23,
    rating: 4.8,
    rank: 1,
    networks: ['TIKTOK', 'INSTAGRAM'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-2',
    name: 'Lucas Martin',
    username: 'lucas_clips',
    avatar: null,
    totalViews: 356200,
    totalClips: 18,
    rating: 4.7,
    rank: 2,
    networks: ['YOUTUBE', 'TIKTOK'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-3',
    name: 'Sophie Laurent',
    username: 'sophie_content',
    avatar: null,
    totalViews: 298400,
    totalClips: 15,
    rating: 4.6,
    rank: 3,
    networks: ['INSTAGRAM', 'YOUTUBE'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-4',
    name: 'Thomas Bernard',
    username: 'thomas_creator',
    avatar: null,
    totalViews: 245800,
    totalClips: 14,
    rating: 4.5,
    rank: 4,
    networks: ['TIKTOK'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-5',
    name: 'Emma Petit',
    username: 'emma_videos',
    avatar: null,
    totalViews: 198600,
    totalClips: 12,
    rating: 4.4,
    rank: 5,
    networks: ['INSTAGRAM', 'TIKTOK'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-6',
    name: 'Alexandre Roux',
    username: 'alex_media',
    avatar: null,
    totalViews: 167300,
    totalClips: 11,
    rating: 4.3,
    rank: 6,
    networks: ['YOUTUBE'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-7',
    name: 'Léa Moreau',
    username: 'lea_digital',
    avatar: null,
    totalViews: 142500,
    totalClips: 10,
    rating: 4.2,
    rank: 7,
    networks: ['TIKTOK', 'INSTAGRAM'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-8',
    name: 'Hugo Simon',
    username: 'hugo_shorts',
    avatar: null,
    totalViews: 118900,
    totalClips: 9,
    rating: 4.2,
    rank: 8,
    networks: ['YOUTUBE', 'INSTAGRAM'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-9',
    name: 'Chloé Blanc',
    username: 'chloe_reels',
    avatar: null,
    totalViews: 95400,
    totalClips: 8,
    rating: 4.1,
    rank: 9,
    networks: ['INSTAGRAM'],
    totalEarnings: 0,
    followers: 0
  },
  {
    id: 'example-10',
    name: 'Nathan Garnier',
    username: 'nathan_viral',
    avatar: null,
    totalViews: 78200,
    totalClips: 7,
    rating: 4.0,
    rank: 10,
    networks: ['TIKTOK', 'YOUTUBE'],
    totalEarnings: 0,
    followers: 0
  },
];

// Test user names to filter out
const TEST_USER_NAMES = ['Jean Clipper', 'Marie Creator', 'Test User', 'test', 'Test'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const period = searchParams.get('period') || 'all'; // all, month, week

    // Calculate date filter based on period
    let dateFilter = {};
    if (period === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter = {
        submittedAt: {
          gte: oneMonthAgo
        }
      };
    } else if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = {
        submittedAt: {
          gte: oneWeekAgo
        }
      };
    }

    // Get clippers (users with CLIPPER role) with their views, earnings and clips count
    // Filter out test users
    const clippers = await prisma.user.findMany({
      where: {
        role: 'CLIPPER',
        NOT: {
          OR: TEST_USER_NAMES.map(name => ({
            name: {
              contains: name,
              mode: 'insensitive'
            }
          }))
        }
      },
      include: {
        profile: true,
        submissions: {
          where: {
            status: 'APPROVED',
            ...dateFilter
          },
          select: {
            amountEarned: true,
            views: true,
            status: true
          }
        },
        socialAccounts: {
          select: {
            platform: true,
            username: true,
            followers: true
          }
        }
      }
    });

    // Calculate stats for each clipper
    const clippersWithStats = clippers.map((clipper: any) => {
      const totalEarnings = clipper.submissions.reduce((sum: number, submission: any) => {
        const amount = submission.amountEarned ? parseFloat(submission.amountEarned.toString()) : 0;
        return sum + amount;
      }, 0);
      const totalViews = clipper.submissions.reduce((sum: number, submission: any) => {
        return sum + (submission.views || 0);
      }, 0);
      const totalClips = clipper.submissions.length;
      
      // Get primary social account
      const primaryAccount = clipper.socialAccounts[0];
      
      // Calculate rating (simple formula based on views and clips)
      const rating = totalClips > 0 ? Math.min(5, (totalViews / (totalClips * 10000)) * 5) : 0;
      
      // Get networks from social accounts
      const networks = [...new Set(clipper.socialAccounts.map((acc: any) => acc.platform))];

      return {
        id: clipper.id,
        name: clipper.name || 'Anonyme',
        username: primaryAccount?.username || clipper.email?.split('@')[0] || 'user',
        avatar: clipper.image || null,
        totalEarnings,
        totalViews,
        totalClips,
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal
        networks,
        followers: clipper.socialAccounts.reduce((sum: number, acc: any) => sum + (acc.followers || 0), 0)
      };
    });

    // Filter out clippers with 0 views (likely test users)
    const validClippers = clippersWithStats.filter((clipper: any) => clipper.totalViews > 0);

    // Sort by total views
    validClippers.sort((a: any, b: any) => b.totalViews - a.totalViews);

    // If no valid production clippers, use example data
    let topClippers;
    if (validClippers.length === 0) {
      topClippers = exampleClippers.slice(0, limit);
    } else {
      // Add rank to valid clippers
      topClippers = validClippers.slice(0, limit).map((clipper: any, index: number) => ({
        ...clipper,
        rank: index + 1
      }));
    }

    // Get platform statistics
    const stats = {
      totalCampaigns: await prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      activeClippers: await prisma.user.count({ where: { role: 'CLIPPER' } }),
      totalDistributed: await prisma.submission.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amountEarned: true }
      }).then((result: any) => {
        const amount = result._sum.amountEarned;
        return amount ? parseFloat(amount.toString()) : 0;
      }),
      totalClips: await prisma.submission.count({ where: { status: 'APPROVED' } }),
      averageEarnings: 0,
      countries: 15 // Hardcoded for now
    };

    // Calculate average earnings
    if (stats.totalClips > 0) {
      stats.averageEarnings = Math.round(stats.totalDistributed / stats.totalClips);
    }

    return NextResponse.json({
      clippers: topClippers,
      stats,
      period
    });
  } catch (error) {
    console.error('Error fetching top clippers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top clippers' },
      { status: 500 }
    );
  }
}