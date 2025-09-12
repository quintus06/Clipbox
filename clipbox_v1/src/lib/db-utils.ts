import { prisma } from './prisma'
import { 
  UserRole, 
  SubscriptionPlan, 
  CampaignStatus, 
  SubmissionStatus,
  TransactionType,
  TransactionStatus,
  KYCStatus,
  Platform,
  Language
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// ==================== USER UTILITIES ====================

/**
 * Get user by email with profile
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      subscription: true,
      balances: true,
      kycVerification: true,
      socialAccounts: true
    }
  })
}

/**
 * Get user by ID with all relations
 */
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      subscription: true,
      balances: true,
      kycVerification: true,
      socialAccounts: true,
      campaigns: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      },
      submissions: {
        take: 10,
        orderBy: { submittedAt: 'desc' }
      }
    }
  })
}

/**
 * Create a new user with profile
 */
export async function createUser(data: {
  email: string
  name?: string
  role?: UserRole
  language?: Language
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role || UserRole.CLIPPER,
      language: data.language || Language.FR,
      profile: {
        create: {}
      },
      balances: {
        create: {
          currency: 'EUR'
        }
      }
    },
    include: {
      profile: true,
      balances: true
    }
  })
}

/**
 * Update user last login
 */
export async function updateLastLogin(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() }
  })
}

// ==================== CAMPAIGN UTILITIES ====================

/**
 * Get active campaigns
 */
export async function getActiveCampaigns(options?: {
  platforms?: Platform[]
  languages?: Language[]
  minBudget?: number
}) {
  const now = new Date()
  
  return await prisma.campaign.findMany({
    where: {
      status: CampaignStatus.ACTIVE,
      startDate: { lte: now },
      endDate: { gte: now },
      remainingBudget: { gt: 0 },
      ...(options?.platforms && {
        targetPlatforms: { hasSome: options.platforms }
      }),
      ...(options?.languages && {
        targetLanguages: { hasSome: options.languages }
      }),
      ...(options?.minBudget && {
        budget: { gte: options.minBudget }
      })
    },
    include: {
      advertiser: {
        include: {
          profile: true
        }
      },
      tags: true,
      _count: {
        select: {
          submissions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Get campaign by ID with full details
 */
export async function getCampaignById(id: string) {
  return await prisma.campaign.findUnique({
    where: { id },
    include: {
      advertiser: {
        include: {
          profile: true
        }
      },
      submissions: {
        include: {
          clipper: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      },
      tags: true
    }
  })
}

/**
 * Create a new campaign
 */
export async function createCampaign(data: {
  advertiserId: string
  title: string
  description: string
  requirements: string
  budget: number
  pricePerClip: number
  paymentRatio: number
  targetPlatforms: Platform[]
  targetLanguages: Language[]
  targetCountries: string[]
  startDate: Date
  endDate: Date
  videoUrl?: string
  minFollowers?: number
  maxClippers?: number
  tags?: string[]
}) {
  const { tags, ...campaignData } = data
  
  return await prisma.campaign.create({
    data: {
      ...campaignData,
      budget: new Decimal(data.budget),
      remainingBudget: new Decimal(data.budget),
      pricePerClip: new Decimal(data.pricePerClip),
      tags: tags ? {
        create: tags.map(tag => ({ tag }))
      } : undefined
    },
    include: {
      advertiser: true,
      tags: true
    }
  })
}

// ==================== SUBMISSION UTILITIES ====================

/**
 * Get submissions for a clipper
 */
export async function getClipperSubmissions(clipperId: string, status?: SubmissionStatus) {
  return await prisma.submission.findMany({
    where: {
      clipperId,
      ...(status && { status })
    },
    include: {
      campaign: {
        include: {
          advertiser: true
        }
      },
      metrics: {
        orderBy: { date: 'desc' },
        take: 7
      }
    },
    orderBy: { submittedAt: 'desc' }
  })
}

/**
 * Create a submission
 */
export async function createSubmission(data: {
  campaignId: string
  clipperId: string
  clipUrl: string
  platform: Platform
  description?: string
  thumbnailUrl?: string
}) {
  // Check if campaign accepts submissions
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId },
    select: {
      status: true,
      remainingBudget: true,
      pricePerClip: true,
      maxClippers: true,
      _count: {
        select: {
          submissions: {
            where: { status: SubmissionStatus.APPROVED }
          }
        }
      }
    }
  })

  if (!campaign || campaign.status !== CampaignStatus.ACTIVE) {
    throw new Error('Campaign is not active')
  }

  if (campaign.remainingBudget.lessThan(campaign.pricePerClip)) {
    throw new Error('Campaign budget exhausted')
  }

  if (campaign.maxClippers && campaign._count.submissions >= campaign.maxClippers) {
    throw new Error('Campaign has reached maximum clippers')
  }

  return await prisma.submission.create({
    data,
    include: {
      campaign: true,
      clipper: true
    }
  })
}

/**
 * Approve a submission
 */
export async function approveSubmission(submissionId: string, reviewerNotes?: string) {
  return await prisma.$transaction(async (tx) => {
    // Get submission with campaign details
    const submission = await tx.submission.findUnique({
      where: { id: submissionId },
      include: {
        campaign: true
      }
    })

    if (!submission) {
      throw new Error('Submission not found')
    }

    // Update submission status
    const updatedSubmission = await tx.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.APPROVED,
        approvedAt: new Date(),
        reviewerNotes,
        amountEarned: submission.campaign.pricePerClip
      }
    })

    // Update campaign statistics and budget
    await tx.campaign.update({
      where: { id: submission.campaignId },
      data: {
        approvedSubmissions: { increment: 1 },
        remainingBudget: { decrement: submission.campaign.pricePerClip }
      }
    })

    // Create initial payment transaction (50% on approval)
    const initialPayment = submission.campaign.pricePerClip.mul(submission.campaign.paymentRatio)
    
    await tx.transaction.create({
      data: {
        userId: submission.clipperId,
        type: TransactionType.CAMPAIGN_PAYMENT,
        status: TransactionStatus.PENDING,
        amount: initialPayment,
        campaignId: submission.campaignId,
        submissionId: submission.id,
        description: `Payment for clip - Campaign: ${submission.campaign.title}`
      }
    })

    // Update clipper balance
    await tx.balance.update({
      where: {
        userId_currency: {
          userId: submission.clipperId,
          currency: 'EUR'
        }
      },
      data: {
        pending: { increment: initialPayment }
      }
    })

    return updatedSubmission
  })
}

// ==================== BALANCE & TRANSACTION UTILITIES ====================

/**
 * Get user balance
 */
export async function getUserBalance(userId: string, currency: string = 'EUR') {
  const balance = await prisma.balance.findUnique({
    where: {
      userId_currency: {
        userId,
        currency
      }
    }
  })

  if (!balance) {
    // Create balance if it doesn't exist
    return await prisma.balance.create({
      data: {
        userId,
        currency
      }
    })
  }

  return balance
}

/**
 * Process withdrawal request
 */
export async function requestWithdrawal(userId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    const balance = await tx.balance.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: 'EUR'
        }
      }
    })

    if (!balance || balance.available.lessThan(amount)) {
      throw new Error('Insufficient balance')
    }

    // Create withdrawal transaction
    const transaction = await tx.transaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        amount: new Decimal(amount),
        description: 'Withdrawal request'
      }
    })

    // Update balance
    await tx.balance.update({
      where: {
        userId_currency: {
          userId,
          currency: 'EUR'
        }
      },
      data: {
        available: { decrement: amount },
        pending: { increment: amount }
      }
    })

    return transaction
  })
}

// ==================== SUBSCRIPTION UTILITIES ====================

/**
 * Get subscription limits for a plan
 */
export function getSubscriptionLimits(plan: SubscriptionPlan) {
  const limits = {
    [SubscriptionPlan.BASIC]: {
      maxCampaigns: 3,
      maxSubmissions: 50,
      commissionRate: 0.15 // 15%
    },
    [SubscriptionPlan.PRO]: {
      maxCampaigns: 10,
      maxSubmissions: 200,
      commissionRate: 0.10 // 10%
    },
    [SubscriptionPlan.GOAT]: {
      maxCampaigns: -1, // Unlimited
      maxSubmissions: -1, // Unlimited
      commissionRate: 0.05 // 5%
    }
  }

  return limits[plan]
}

/**
 * Create or update subscription
 */
export async function upsertSubscription(data: {
  userId: string
  plan: SubscriptionPlan
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}) {
  const limits = getSubscriptionLimits(data.plan)
  
  return await prisma.subscription.upsert({
    where: { userId: data.userId },
    update: {
      ...data,
      ...limits
    },
    create: {
      ...data,
      ...limits
    }
  })
}

// ==================== NOTIFICATION UTILITIES ====================

/**
 * Create notification
 */
export async function createNotification(data: {
  userId: string
  type: string
  title: string
  message: string
  data?: any
}) {
  return await prisma.notification.create({
    data: {
      ...data,
      type: data.type as any
    }
  })
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  return await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds }
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  })
}

// ==================== STATISTICS UTILITIES ====================

/**
 * Get clipper statistics
 */
export async function getClipperStats(clipperId: string) {
  const [submissions, earnings, reviews] = await Promise.all([
    // Total submissions and approved
    prisma.submission.groupBy({
      by: ['clipperId'],
      where: { clipperId },
      _count: {
        id: true
      }
    }),
    
    // Total earnings
    prisma.transaction.aggregate({
      where: {
        userId: clipperId,
        type: TransactionType.CAMPAIGN_PAYMENT,
        status: TransactionStatus.COMPLETED
      },
      _sum: {
        amount: true
      }
    }),
    
    // Average rating
    prisma.review.aggregate({
      where: { targetUserId: clipperId },
      _avg: {
        rating: true
      },
      _count: {
        id: true
      }
    })
  ])

  return {
    totalSubmissions: submissions[0]?._count.id || 0,
    totalEarnings: earnings._sum.amount || new Decimal(0),
    averageRating: reviews._avg.rating || 0,
    totalReviews: reviews._count.id || 0
  }
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(campaignId: string) {
  const submissions = await prisma.submission.findMany({
    where: { campaignId },
    include: {
      metrics: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  })

  const stats = submissions.reduce((acc, submission) => {
    const latestMetrics = submission.metrics[0]
    if (latestMetrics) {
      acc.totalViews += latestMetrics.views
      acc.totalLikes += latestMetrics.likes
      acc.totalShares += latestMetrics.shares
      acc.totalComments += latestMetrics.comments
    }
    return acc
  }, {
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0
  })

  return {
    ...stats,
    totalSubmissions: submissions.length,
    approvedSubmissions: submissions.filter(s => s.status === SubmissionStatus.APPROVED).length,
    pendingSubmissions: submissions.filter(s => s.status === SubmissionStatus.PENDING).length,
    rejectedSubmissions: submissions.filter(s => s.status === SubmissionStatus.REJECTED).length
  }
}

// ==================== SEARCH UTILITIES ====================

/**
 * Search campaigns
 */
export async function searchCampaigns(query: string, filters?: {
  status?: CampaignStatus
  platforms?: Platform[]
  languages?: Language[]
  minBudget?: number
  maxBudget?: number
}) {
  return await prisma.campaign.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { some: { tag: { contains: query, mode: 'insensitive' } } } }
      ],
      ...(filters?.status && { status: filters.status }),
      ...(filters?.platforms && { targetPlatforms: { hasSome: filters.platforms } }),
      ...(filters?.languages && { targetLanguages: { hasSome: filters.languages } }),
      ...(filters?.minBudget && { budget: { gte: filters.minBudget } }),
      ...(filters?.maxBudget && { budget: { lte: filters.maxBudget } })
    },
    include: {
      advertiser: {
        include: {
          profile: true
        }
      },
      tags: true,
      _count: {
        select: {
          submissions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
}

/**
 * Search users
 */
export async function searchUsers(query: string, role?: UserRole) {
  return await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { profile: { bio: { contains: query, mode: 'insensitive' } } }
      ],
      ...(role && { role })
    },
    include: {
      profile: true,
      socialAccounts: true,
      _count: {
        select: {
          submissions: true,
          campaigns: true,
          reviews: true
        }
      }
    },
    take: 50
  })
}

// ==================== AUDIT UTILITIES ====================

/**
 * Create audit log entry
 */
export async function createAuditLog(data: {
  userId?: string
  action: string
  entity: string
  entityId?: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
}) {
  return await prisma.auditLog.create({
    data
  })
}

/**
 * Get audit logs
 */
export async function getAuditLogs(filters?: {
  userId?: string
  entity?: string
  startDate?: Date
  endDate?: Date
}) {
  return await prisma.auditLog.findMany({
    where: {
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.entity && { entity: filters.entity }),
      ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
      ...(filters?.endDate && { createdAt: { lte: filters.endDate } })
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })
}