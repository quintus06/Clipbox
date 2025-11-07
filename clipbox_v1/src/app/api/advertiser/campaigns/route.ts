import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Récupérer les campagnes de l'annonceur
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification via le cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    if (!user || user.role !== 'ADVERTISER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        advertiserId: user.id
      },
      include: {
        _count: {
          select: {
            submissions: true
          }
        },
        submissions: {
          where: {
            status: 'APPROVED'
          },
          select: {
            amountEarned: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculer les statistiques pour chaque campagne
    const campaignsWithStats = campaigns.map((campaign: any) => {
      const approvedSubmissions = campaign.submissions.length;
      const totalSpent = campaign.submissions.reduce((sum: number, sub: any) => sum + sub.amountEarned, 0);
      
      return {
        ...campaign,
        totalSubmissions: campaign._count.submissions,
        approvedSubmissions,
        totalSpent,
        submissions: undefined,
        _count: undefined
      };
    });

    return NextResponse.json(campaignsWithStats);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle campagne
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via le cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    if (!user || user.role !== 'ADVERTISER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[Campaign Creation] Request body:', JSON.stringify(body, null, 2));
    console.log('[Campaign Creation] User ID:', user.id);
    
    // Validation des données
    if (!body.title || !body.description || !body.budget || body.budget < 100) {
      console.error('[Campaign Creation] Validation failed:', { title: body.title, description: body.description, budget: body.budget });
      return NextResponse.json(
        { error: 'Invalid campaign data' },
        { status: 400 }
      );
    }

    // Vérifier la balance disponible
    console.log('[Campaign Creation] Checking balance for user:', user.id);
    const balance = await prisma.balance.findUnique({
      where: {
        userId_currency: {
          userId: user.id,
          currency: 'EUR'
        }
      }
    });

    console.log('[Campaign Creation] Balance found:', balance ? { available: balance.available.toString(), pending: balance.pending.toString() } : 'NO BALANCE RECORD');

    if (!balance) {
      console.error('[Campaign Creation] No balance record found for user:', user.id);
      return NextResponse.json(
        { error: 'Balance not initialized. Please contact support.' },
        { status: 400 }
      );
    }

    if (balance.available < body.budget) {
      console.error('[Campaign Creation] Insufficient balance:', { available: balance.available.toString(), required: body.budget });
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Créer la campagne
    console.log('[Campaign Creation] Creating campaign...');
    const campaign = await prisma.campaign.create({
      data: {
        advertiserId: user.id,
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        videoUrl: body.videoUrl || null,
        budget: body.budget,
        remainingBudget: body.budget,
        paymentRatio: body.paymentRatio || 70,
        pricePerClip: (body.budget * (body.paymentRatio || 70) / 100) / (body.maxClippers || 50),
        targetPlatforms: body.platform ? [body.platform] : ['TIKTOK'],
        targetLanguages: body.targetLanguages || [],
        targetCountries: body.targetCountries || [],
        minFollowers: body.minFollowers || 1000,
        maxClippers: body.maxClippers || 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + (body.duration || 2) * 30 * 24 * 60 * 60 * 1000),
        status: 'DRAFT' // Changed from PENDING to DRAFT (valid enum value)
      }
    });

    console.log('[Campaign Creation] Campaign created:', campaign.id);

    // Mettre à jour la balance (engager le budget)
    console.log('[Campaign Creation] Updating balance...');
    await prisma.balance.update({
      where: {
        userId_currency: {
          userId: user.id,
          currency: 'EUR'
        }
      },
      data: {
        available: {
          decrement: body.budget
        },
        pending: {
          increment: body.budget
        }
      }
    });

    console.log('[Campaign Creation] Balance updated');

    // Créer une transaction
    console.log('[Campaign Creation] Creating transaction...');
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'CAMPAIGN_PAYMENT',
        amount: -body.budget,
        description: `Budget engagé pour la campagne: ${body.title}`,
        status: 'COMPLETED',
        campaignId: campaign.id
      }
    });

    console.log('[Campaign Creation] Transaction created');
    console.log('[Campaign Creation] SUCCESS - Campaign created:', campaign.id);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('[Campaign Creation] ERROR:', error);
    console.error('[Campaign Creation] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[Campaign Creation] Error message:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une campagne
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification via le cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    if (!user || user.role !== 'ADVERTISER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400 }
      );
    }

    // Vérifier que la campagne appartient à l'utilisateur
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id,
        advertiserId: user.id
      }
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Mettre à jour la campagne
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}