import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// PATCH - Augmenter le budget d'une campagne
export async function PATCH(
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
    const body = await request.json();
    const { newBudget } = body;

    // Validation du nouveau budget
    if (!newBudget || typeof newBudget !== 'number' || newBudget <= 0) {
      return NextResponse.json(
        { error: 'Le nouveau budget doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Récupérer la campagne existante
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

    // Vérifier que c'est bien une augmentation
    const currentBudget = Number(campaign.budget);
    if (newBudget <= currentBudget) {
      return NextResponse.json(
        { error: 'Le nouveau budget doit être supérieur au budget actuel' },
        { status: 400 }
      );
    }

    // Calculer l'augmentation
    const budgetIncrease = newBudget - currentBudget;

    // Récupérer la balance de l'annonceur
    const balance = await prisma.balance.findFirst({
      where: {
        userId: user.id,
        currency: 'EUR'
      }
    });

    if (!balance) {
      return NextResponse.json(
        { 
          error: 'Balance non trouvée',
          message: 'Veuillez contacter le support'
        },
        { status: 404 }
      );
    }

    // Vérifier que la balance disponible est suffisante
    const availableBalance = Number(balance.available);
    if (availableBalance < budgetIncrease) {
      return NextResponse.json(
        { 
          error: 'Fonds insuffisants',
          message: `Fonds insuffisants. Votre solde actuel est de ${availableBalance.toFixed(2)}€. Vous avez besoin de ${budgetIncrease.toFixed(2)}€ supplémentaires pour augmenter le budget. Veuillez recharger votre compte.`,
          currentBalance: availableBalance,
          requiredAmount: budgetIncrease,
          shortfall: budgetIncrease - availableBalance
        },
        { status: 400 }
      );
    }

    // Effectuer la mise à jour dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour la campagne
      const updatedCampaign = await tx.campaign.update({
        where: { id },
        data: {
          budget: newBudget,
          remainingBudget: {
            increment: budgetIncrease
          }
        }
      });

      // Mettre à jour la balance (déduire de available, ajouter à pending)
      await tx.balance.update({
        where: {
          userId_currency: {
            userId: user.id,
            currency: 'EUR'
          }
        },
        data: {
          available: {
            decrement: budgetIncrease
          },
          pending: {
            increment: budgetIncrease
          }
        }
      });

      // Créer une transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'CAMPAIGN_PAYMENT',
          amount: -budgetIncrease,
          currency: 'EUR',
          description: `Augmentation du budget de la campagne: ${campaign.title}`,
          status: 'COMPLETED',
          campaignId: id,
          completedAt: new Date()
        }
      });

      return updatedCampaign;
    });

    return NextResponse.json({
      success: true,
      message: `Budget augmenté de ${budgetIncrease.toFixed(2)}€ avec succès!`,
      campaign: result,
      budgetIncrease
    });

  } catch (error) {
    console.error('Error increasing campaign budget:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}