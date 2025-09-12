import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Récupérer les statistiques globales de l'annonceur
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

    // Récupérer toutes les campagnes de l'annonceur
    const campaigns = await prisma.campaign.findMany({
      where: {
        advertiserId: user.id
      },
      include: {
        submissions: {
          select: {
            status: true,
            views: true,
            likes: true,
            shares: true,
            watchTime: true,
            amountEarned: true,
            submittedAt: true
          }
        }
      }
    });

    // Calculer les statistiques globales
    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
      pendingCampaigns: campaigns.filter(c => c.status === 'PENDING').length,
      completedCampaigns: campaigns.filter(c => c.status === 'COMPLETED').length,
      
      totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + (c.budget - c.remainingBudget), 0),
      
      totalViews: campaigns.reduce((sum, c) => sum + c.totalViews, 0),
      totalLikes: campaigns.reduce((sum, c) => sum + c.totalLikes, 0),
      totalShares: campaigns.reduce((sum, c) => sum + c.totalShares, 0),
      
      totalSubmissions: campaigns.reduce((sum, c) => sum + c.totalSubmissions, 0),
      approvedSubmissions: campaigns.reduce((sum, c) => sum + c.approvedSubmissions, 0),
      rejectedSubmissions: campaigns.reduce((sum, c) => 
        sum + c.submissions.filter(s => s.status === 'REJECTED').length, 0
      ),
      
      averageROI: 0, // À calculer selon la logique métier
      averageEngagementRate: 0, // À calculer
      
      // Statistiques temporelles (30 derniers jours)
      last30Days: {
        views: 0,
        submissions: 0,
        spent: 0
      }
    };

    // Calculer les stats des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    campaigns.forEach(campaign => {
      campaign.submissions.forEach(submission => {
        if (submission.submittedAt && submission.submittedAt >= thirtyDaysAgo) {
          stats.last30Days.views += submission.views || 0;
          stats.last30Days.submissions += 1;
          if (submission.status === 'APPROVED') {
            stats.last30Days.spent += submission.amountEarned || 0;
          }
        }
      });
    });

    // Calculer le taux d'engagement moyen
    if (stats.totalViews > 0) {
      stats.averageEngagementRate = ((stats.totalLikes + stats.totalShares) / stats.totalViews) * 100;
    }

    // Récupérer la balance
    const balance = await prisma.balance.findUnique({
      where: {
        userId: user.id
      }
    });

    // Récupérer les transactions récentes
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Données pour les graphiques
    const performanceData = generatePerformanceData(campaigns);
    const budgetDistribution = generateBudgetDistribution(campaigns, balance);

    return NextResponse.json({
      stats,
      balance: balance || {
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0,
        currency: 'EUR'
      },
      recentTransactions,
      performanceData,
      budgetDistribution
    });
  } catch (error) {
    console.error('Error fetching advertiser stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fonction helper pour générer les données de performance
function generatePerformanceData(campaigns: any[]) {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayData = {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      vues: 0,
      clics: 0,
      conversions: 0
    };
    
    // Agrégation des données pour cette journée
    campaigns.forEach(campaign => {
      campaign.submissions.forEach((submission: any) => {
        if (submission.submittedAt) {
          const subDate = new Date(submission.submittedAt);
          if (subDate.toDateString() === date.toDateString()) {
            dayData.vues += submission.views || 0;
            dayData.clics += submission.likes || 0;
            if (submission.status === 'APPROVED') {
              dayData.conversions += 1;
            }
          }
        }
      });
    });
    
    last7Days.push(dayData);
  }
  
  return last7Days;
}

// Fonction helper pour générer la distribution du budget
function generateBudgetDistribution(campaigns: any[], balance: any) {
  const activeBudget = campaigns
    .filter(c => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + c.remainingBudget, 0);
    
  const pendingBudget = campaigns
    .filter(c => c.status === 'PENDING')
    .reduce((sum, c) => sum + c.budget, 0);
    
  const availableBalance = balance?.availableBalance || 0;
  
  return [
    { name: 'Campagnes actives', value: activeBudget, color: '#10b981' },
    { name: 'En attente', value: pendingBudget, color: '#f59e0b' },
    { name: 'Disponible', value: availableBalance, color: '#6b7280' }
  ];
}