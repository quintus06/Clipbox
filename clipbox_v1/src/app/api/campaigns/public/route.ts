import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    const sortBy = searchParams.get('sortBy') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '9');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
      endDate: {
        gte: new Date()
      }
    };

    if (network && network !== 'all') {
      where.targetPlatform = network;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'budget':
        orderBy = { budget: 'desc' };
        break;
      case 'ending':
        orderBy = { endDate: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch campaigns with related data
    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
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
      }
    });

    // Calculate budget spent for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign: any, index: number) => {
        // Get total spent from submissions
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

        // Sample image URLs for campaigns
        const sampleImages = [
          'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop', // Social media campaign
          'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop', // Fashion campaign
          'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop', // Business campaign
          'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=400&fit=crop', // Food campaign
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop', // Tech campaign
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop', // E-commerce campaign
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', // Analytics campaign
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // Data campaign
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'  // Team campaign
        ];

        // Use thumbnailUrl if available, otherwise use a sample image based on index
        const imageUrl = campaign.thumbnailUrl || sampleImages[index % sampleImages.length];

        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description || '',
          imageUrl: imageUrl,
          budget: parseFloat(campaign.budget.toString()),
          budgetSpent,
          network: campaign.targetPlatforms[0] || 'TIKTOK',
          participantsCount: campaign._count.submissions,
          endDate: campaign.endDate,
          advertiserName: campaign.advertiser.profile?.company || campaign.advertiser.name || 'Anonyme',
          advertiserLogo: campaign.advertiser.image || null,
          createdAt: campaign.createdAt
        };
      })
    );

    // Get total count for pagination
    const totalCount = await prisma.campaign.count({ where });

    return NextResponse.json({
      campaigns: campaignsWithStats,
      totalCount,
      hasMore: offset + limit < totalCount
    });
  } catch (error) {
    console.error('Error fetching public campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}