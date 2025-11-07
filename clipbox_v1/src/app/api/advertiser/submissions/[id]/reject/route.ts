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
    const body = await request.json();
    const { reviewerNotes } = body;

    // Validate rejection reason
    if (!reviewerNotes || typeof reviewerNotes !== 'string') {
      return NextResponse.json(
        { error: 'Le motif du rejet est obligatoire' },
        { status: 400 }
      );
    }

    if (reviewerNotes.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le motif doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    // Verify the submission exists and belongs to advertiser's campaign
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        campaign: {
          select: {
            advertiserId: true,
            title: true,
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
        { error: 'Non autorisé à rejeter cette soumission' },
        { status: 403 }
      );
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette soumission a déjà été traitée' },
        { status: 400 }
      );
    }

    // Update submission status to REJECTED
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        reviewerNotes: reviewerNotes.trim(),
      },
    });

    // Note: Campaign model doesn't have rejectedSubmissions field
    // Statistics can be calculated from submissions when needed

    // Create notification for clipper
    await prisma.notification.create({
      data: {
        userId: submission.clipperId,
        type: 'SUBMISSION_STATUS',
        title: 'Soumission rejetée',
        message: `Votre soumission pour "${submission.campaign.title}" a été rejetée.`,
        data: {
          submissionId: submission.id,
          campaignId: submission.campaignId,
          reviewerNotes: reviewerNotes.trim(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
      message: 'Soumission rejetée avec succès',
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    return NextResponse.json(
      { error: 'Erreur lors du rejet de la soumission' },
      { status: 500 }
    );
  }
}