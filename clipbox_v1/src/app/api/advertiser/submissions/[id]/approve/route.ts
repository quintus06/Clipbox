import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication via cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    if (!user || user.role !== 'ADVERTISER') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const submissionId = params.id;

    // Verify the submission exists and belongs to advertiser's campaign
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        campaign: {
          select: {
            advertiserId: true,
            remainingBudget: true,
            pricePerClip: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Soumission non trouvée' },
        { status: 404 }
      );
    }

    if (submission.campaign.advertiserId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé à approuver cette soumission' },
        { status: 403 }
      );
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette soumission a déjà été traitée' },
        { status: 400 }
      );
    }

    // Check if campaign has enough budget
    if (submission.campaign.remainingBudget < submission.campaign.pricePerClip) {
      return NextResponse.json(
        { error: 'Budget insuffisant pour approuver cette soumission' },
        { status: 400 }
      );
    }

    // Update submission status to APPROVED
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        amountEarned: submission.campaign.pricePerClip,
      },
    });

    // Update campaign statistics and budget
    await prisma.campaign.update({
      where: { id: submission.campaignId },
      data: {
        approvedSubmissions: { increment: 1 },
        remainingBudget: { decrement: submission.campaign.pricePerClip },
      },
    });

    // Create notification for clipper
    await prisma.notification.create({
      data: {
        userId: submission.clipperId,
        type: 'SUBMISSION_STATUS',
        title: 'Soumission approuvée',
        message: `Votre soumission a été approuvée ! Vous avez gagné ${submission.campaign.pricePerClip}€.`,
        data: {
          submissionId: submission.id,
          campaignId: submission.campaignId,
          amount: submission.campaign.pricePerClip.toString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
      message: 'Soumission approuvée avec succès',
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation de la soumission' },
      { status: 500 }
    );
  }
}