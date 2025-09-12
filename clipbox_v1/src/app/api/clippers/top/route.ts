import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Get clippers (users with CLIPPER role) with their earnings and clips count
    const clippers = await prisma.user.findMany({
      where: {
        role: 'CLIPPER'
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
      const totalClips = clipper.submissions.length;
      
      // Get primary social account
      const primaryAccount = clipper.socialAccounts[0];
      
      // Calculate rating (simple formula based on earnings and clips)
      const rating = totalClips > 0 ? Math.min(5, (totalEarnings / (totalClips * 50)) * 5) : 0;
      
      // Get networks from social accounts
      const networks = [...new Set(clipper.socialAccounts.map((acc: any) => acc.platform))];

      return {
        id: clipper.id,
        name: clipper.name || 'Anonyme',
        username: primaryAccount?.username || clipper.email?.split('@')[0] || 'user',
        avatar: clipper.image || null,
        totalEarnings,
        totalClips,
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal
        networks,
        followers: clipper.socialAccounts.reduce((sum: number, acc: any) => sum + (acc.followers || 0), 0)
      };
    });

    // Sort by total earnings
    clippersWithStats.sort((a: any, b: any) => b.totalEarnings - a.totalEarnings);

    // Add rank
    const topClippers = clippersWithStats.slice(0, limit).map((clipper: any, index: number) => ({
      ...clipper,
      rank: index + 1
    }));

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