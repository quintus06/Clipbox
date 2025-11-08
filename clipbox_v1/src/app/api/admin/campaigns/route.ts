import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Fetch all campaigns for admin (including DRAFT status)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication via cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    // Verify user is an admin
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch ALL campaigns regardless of status
    const campaigns = await prisma.campaign.findMany({
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: {
              select: {
                company: true
              }
            }
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Newest first
      }
    });

    // Calculate budget spent for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign: any) => {
        // Get total spent from approved submissions
        const submissions = await prisma.submission.findMany({
          where: {
            campaignId: campaign.id,
            status: 'APPROVED'
          },
          select: {
            amountEarned: true
          }
        });

        const budgetSpent = submissions.reduce((total: number, submission: any) => {
          const amount = submission.amountEarned ? parseFloat(submission.amountEarned.toString()) : 0;
          return total + amount;
        }, 0);

        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description || '',
          imageUrl: campaign.thumbnailUrl || null,
          budget: parseFloat(campaign.budget.toString()),
          budgetSpent,
          network: campaign.targetPlatforms[0] || 'TIKTOK',
          participantsCount: campaign._count.submissions,
          status: campaign.status,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          advertiserName: campaign.advertiser.profile?.company || campaign.advertiser.name || 'Anonyme',
          advertiserLogo: campaign.advertiser.image || null,
          createdAt: campaign.createdAt
        };
      })
    );

    return NextResponse.json({
      campaigns: campaignsWithStats,
      totalCount: campaignsWithStats.length
    });
  } catch (error) {
    console.error('Error fetching admin campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}