import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification via le cookie
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

    const { id } = await params;

    // Vérifier que la campagne existe et appartient à l'utilisateur
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        advertiserId: user.id
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campagne non trouvée' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Seules les campagnes actives peuvent être mises en pause' },
        { status: 400 }
      );
    }

    // Mettre la campagne en pause
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: 'PAUSED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      message: 'Campagne mise en pause avec succès',
    });
  } catch (error) {
    console.error('Error pausing campaign:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise en pause de la campagne' },
      { status: 500 }
    );
  }
}