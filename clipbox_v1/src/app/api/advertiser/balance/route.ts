import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Récupérer les informations de balance et transactions
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

    // Récupérer la balance
    const balance = await prisma.balance.findUnique({
      where: {
        userId: user.id
      }
    });

    // Si pas de balance, la créer
    if (!balance) {
      const newBalance = await prisma.balance.create({
        data: {
          userId: user.id,
          totalBalance: 0,
          availableBalance: 0,
          lockedBalance: 0,
          currency: 'EUR'
        }
      });
      
      return NextResponse.json({
        balance: newBalance,
        transactions: []
      });
    }

    // Récupérer les transactions récentes
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    return NextResponse.json({
      balance,
      transactions
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}