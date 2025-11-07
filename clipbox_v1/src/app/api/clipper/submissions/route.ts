import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/prisma';

// POST - Create a new submission
export async function POST(request: NextRequest) {
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

    // Verify user is a clipper
    if (user.role !== 'CLIPPER') {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les clippers peuvent soumettre des vidéos.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { campaignId, accountId, clipUrl, description } = body;

    // Validate required fields
    if (!campaignId || !accountId || !clipUrl) {
      return NextResponse.json(
        { error: 'Champs requis manquants: campaignId, accountId, clipUrl' },
        { status: 400 }
      );
    }

    // Verify the campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        status: true,
        endDate: true,
        remainingBudget: true,
        pricePerClip: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campagne introuvable' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Cette campagne n\'est plus active' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(campaign.endDate)) {
      return NextResponse.json(
        { error: 'Cette campagne est terminée' },
        { status: 400 }
      );
    }

    // Verify the social account belongs to the user
    const socialAccount = await prisma.socialAccount.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        userId: true,
        platform: true,
        username: true,
      },
    });

    if (!socialAccount) {
      return NextResponse.json(
        { error: 'Compte social introuvable' },
        { status: 404 }
      );
    }

    if (socialAccount.userId !== user.id) {
      return NextResponse.json(
        { error: 'Ce compte social ne vous appartient pas' },
        { status: 403 }
      );
    }

    // Check if user already submitted for this campaign with this account
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        campaignId,
        clipperId: user.id,
        clipUrl,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Vous avez déjà soumis cette vidéo pour cette campagne' },
        { status: 400 }
      );
    }

    // Create the submission
    const submission = await prisma.submission.create({
      data: {
        campaignId,
        clipperId: user.id,
        clipUrl,
        platform: socialAccount.platform,
        description: description || null,
        status: 'PENDING',
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            advertiser: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update campaign statistics
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        totalSubmissions: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        campaignId: submission.campaignId,
        campaignTitle: submission.campaign.title,
        advertiser: submission.campaign.advertiser.name,
        clipUrl: submission.clipUrl,
        platform: submission.platform,
        status: submission.status,
        description: submission.description,
        submittedAt: submission.submittedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la soumission' },
      { status: 500 }
    );
  }
}

// GET - Fetch user's submissions
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

    // Verify user is a clipper
    if (user.role !== 'CLIPPER') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    // Fetch all submissions for the user
    const submissions = await prisma.submission.findMany({
      where: {
        clipperId: user.id,
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            advertiser: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({
      submissions: submissions.map(submission => ({
        id: submission.id,
        campaignId: submission.campaignId,
        campaignTitle: submission.campaign.title,
        advertiser: submission.campaign.advertiser.name || 'Annonceur',
        platform: submission.platform,
        clipUrl: submission.clipUrl,
        thumbnailUrl: submission.thumbnailUrl,
        status: submission.status,
        views: submission.views,
        likes: submission.likes,
        shares: submission.shares,
        comments: submission.comments,
        amountEarned: submission.amountEarned ? parseFloat(submission.amountEarned.toString()) : 0,
        submittedAt: submission.submittedAt.toISOString(),
        approvedAt: submission.approvedAt?.toISOString() || null,
        rejectedAt: submission.rejectedAt?.toISOString() || null,
        publishedAt: submission.publishedAt?.toISOString() || null,
        description: submission.description,
        reviewerNotes: submission.reviewerNotes,
        revisionNotes: submission.revisionNotes,
        lastMetricsUpdate: submission.lastMetricsUpdate?.toISOString() || null,
      })),
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des soumissions' },
      { status: 500 }
    );
  }
}