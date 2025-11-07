import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/prisma';

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

    // Fetch all social accounts for the user
    const accounts = await prisma.socialAccount.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      accounts: accounts.map(account => ({
        id: account.id,
        platform: account.platform,
        accountId: account.accountId,
        username: account.username,
        profileUrl: account.profileUrl,
        followers: account.followers,
        isVerified: account.isVerified,
        lastSync: account.lastSync,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des comptes' },
      { status: 500 }
    );
  }
}