import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-wrapper';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// PATCH - Validate a campaign (change status from DRAFT to ACTIVE)
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    
    // Verify user is SUPER_ADMIN
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const campaignId = params.id;

    // Fetch the campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if campaign is in DRAFT status
    if (campaign.status !== 'DRAFT') {
      return NextResponse.json(
        { error: `Campaign is not in DRAFT status. Current status: ${campaign.status}` },
        { status: 400 }
      );
    }

    // Update campaign status to ACTIVE
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date()
      },
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
        }
      }
    });

    // Create a notification for the advertiser
    await prisma.notification.create({
      data: {
        userId: campaign.advertiserId,
        type: 'CAMPAIGN_NEW',
        title: 'Campagne validée',
        message: `Votre campagne "${campaign.title}" a été validée et est maintenant active.`,
        data: {
          campaignId: campaign.id,
          campaignTitle: campaign.title
        }
      }
    });

    // Log the action in audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'VALIDATE_CAMPAIGN',
        entity: 'Campaign',
        entityId: campaignId,
        oldValues: { status: 'DRAFT' },
        newValues: { status: 'ACTIVE' }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign validated successfully',
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        status: updatedCampaign.status,
        advertiserName: updatedCampaign.advertiser.profile?.company || updatedCampaign.advertiser.name || 'Anonyme'
      }
    });
  } catch (error) {
    console.error('Error validating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to validate campaign' },
      { status: 500 }
    );
  }
}

// POST - Alternative endpoint (same functionality as PATCH)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params });
}