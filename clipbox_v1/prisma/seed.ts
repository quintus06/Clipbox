import { PrismaClient } from '@prisma/client'
import { 
  UserRole, 
  SubscriptionPlan, 
  SubscriptionStatus,
  CampaignStatus,
  Platform,
  Language,
  SubmissionStatus,
  TransactionType,
  TransactionStatus,
  NotificationType
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.systemConfig.deleteMany()
  await prisma.favoriteClipper.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.socialAccount.deleteMany()
  await prisma.kYCVerification.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.balance.deleteMany()
  await prisma.submissionMetric.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.campaignTag.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  console.log('👥 Creating test users...')

  // Create Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@clipbox.com',
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      language: Language.FR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Administrateur de la plateforme Clipbox',
          location: 'Paris, France',
          notifyEmail: true,
          notifyPush: true,
          publicProfile: false
        }
      },
      balances: {
        create: {
          currency: 'EUR',
          available: 0,
          pending: 0,
          withdrawn: 0
        }
      }
    },
    include: {
      profile: true,
      balances: true
    }
  })

  // Create test Clippers
  const clipper1 = await prisma.user.create({
    data: {
      email: 'clipper1@test.com',
      name: 'Jean Clipper',
      role: UserRole.CLIPPER,
      language: Language.FR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Créateur de contenu passionné, spécialisé dans les clips viraux',
          website: 'https://example.com/jean',
          location: 'Lyon, France',
          phone: '+33612345678',
          totalEarnings: 1250.50,
          totalClips: 15,
          averageRating: 4.5,
          notifyEmail: true,
          notifyPush: true,
          publicProfile: true
        }
      },
      balances: {
        create: {
          currency: 'EUR',
          available: 850.50,
          pending: 400.00,
          withdrawn: 0
        }
      },
      socialAccounts: {
        create: [
          {
            platform: Platform.TIKTOK,
            accountId: 'jean_clipper_tiktok',
            username: '@jeanclips',
            profileUrl: 'https://tiktok.com/@jeanclips',
            followers: 25000,
            isVerified: true
          },
          {
            platform: Platform.INSTAGRAM_REELS,
            accountId: 'jean_clipper_insta',
            username: '@jeanclips',
            profileUrl: 'https://instagram.com/jeanclips',
            followers: 15000,
            isVerified: false
          }
        ]
      }
    },
    include: {
      profile: true,
      balances: true,
      socialAccounts: true
    }
  })

  const clipper2 = await prisma.user.create({
    data: {
      email: 'clipper2@test.com',
      name: 'Marie Creator',
      role: UserRole.CLIPPER,
      language: Language.FR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Créatrice de contenu lifestyle et beauté',
          website: 'https://example.com/marie',
          location: 'Marseille, France',
          totalEarnings: 2100.00,
          totalClips: 28,
          averageRating: 4.8,
          notifyEmail: true,
          notifyPush: true,
          publicProfile: true
        }
      },
      balances: {
        create: {
          currency: 'EUR',
          available: 1500.00,
          pending: 600.00,
          withdrawn: 0
        }
      },
      socialAccounts: {
        create: [
          {
            platform: Platform.TIKTOK,
            accountId: 'marie_creator_tiktok',
            username: '@mariecreator',
            profileUrl: 'https://tiktok.com/@mariecreator',
            followers: 50000,
            isVerified: true
          },
          {
            platform: Platform.YOUTUBE_SHORTS,
            accountId: 'marie_creator_youtube',
            username: 'MarieCreator',
            profileUrl: 'https://youtube.com/@mariecreator',
            followers: 30000,
            isVerified: true
          }
        ]
      }
    },
    include: {
      profile: true,
      balances: true,
      socialAccounts: true
    }
  })

  // Create test Advertisers
  const advertiser1 = await prisma.user.create({
    data: {
      email: 'advertiser1@test.com',
      name: 'TechCorp France',
      role: UserRole.ADVERTISER,
      language: Language.FR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Entreprise tech innovante cherchant à promouvoir ses produits',
          website: 'https://techcorp.fr',
          location: 'Paris, France',
          company: 'TechCorp France SAS',
          vatNumber: 'FR12345678901',
          siret: '12345678900001',
          notifyEmail: true,
          notifyPush: true,
          publicProfile: true
        }
      },
      balances: {
        create: {
          currency: 'EUR',
          available: 5000.00,
          pending: 0,
          withdrawn: 0
        }
      },
      subscription: {
        create: {
          plan: SubscriptionPlan.PRO,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
          maxCampaigns: 10,
          maxSubmissions: 200,
          commissionRate: 0.10
        }
      }
    },
    include: {
      profile: true,
      balances: true,
      subscription: true
    }
  })

  const advertiser2 = await prisma.user.create({
    data: {
      email: 'advertiser2@test.com',
      name: 'Beauty Brand',
      role: UserRole.ADVERTISER,
      language: Language.FR,
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'Marque de cosmétiques naturels et bio',
          website: 'https://beautybrand.com',
          location: 'Nice, France',
          company: 'Beauty Brand SARL',
          vatNumber: 'FR98765432109',
          siret: '98765432100001',
          notifyEmail: true,
          notifyPush: true,
          publicProfile: true
        }
      },
      balances: {
        create: {
          currency: 'EUR',
          available: 10000.00,
          pending: 0,
          withdrawn: 0
        }
      },
      subscription: {
        create: {
          plan: SubscriptionPlan.GOAT,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
          maxCampaigns: -1, // Unlimited
          maxSubmissions: -1, // Unlimited
          commissionRate: 0.05
        }
      }
    },
    include: {
      profile: true,
      balances: true,
      subscription: true
    }
  })

  // Create test campaigns
  console.log('📢 Creating test campaigns...')

  const campaign1 = await prisma.campaign.create({
    data: {
      advertiserId: advertiser1.id,
      title: 'Lancement App Mobile TechCorp',
      description: 'Nous recherchons des créateurs pour promouvoir notre nouvelle application mobile révolutionnaire. Créez des clips engageants montrant les fonctionnalités uniques de notre app.',
      requirements: '- Montrer au moins 3 fonctionnalités clés\n- Durée: 15-30 secondes\n- Ton dynamique et enthousiaste\n- Hashtags: #TechCorpApp #Innovation #Tech',
      videoUrl: 'https://youtube.com/watch?v=example1',
      thumbnailUrl: 'https://example.com/thumbnail1.jpg',
      status: CampaignStatus.ACTIVE,
      budget: 5000.00,
      remainingBudget: 4000.00,
      paymentRatio: 0.5, // 50% on approval, 50% after 7 days
      pricePerClip: 100.00,
      targetPlatforms: [Platform.TIKTOK, Platform.INSTAGRAM_REELS],
      targetLanguages: [Language.FR],
      targetCountries: ['FR', 'BE', 'CH'],
      minFollowers: 5000,
      maxClippers: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      totalViews: 125000,
      totalLikes: 8500,
      totalShares: 1200,
      totalSubmissions: 10,
      approvedSubmissions: 8,
      tags: {
        create: [
          { tag: 'tech' },
          { tag: 'mobile' },
          { tag: 'app' },
          { tag: 'innovation' }
        ]
      }
    },
    include: {
      tags: true
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      advertiserId: advertiser2.id,
      title: 'Nouvelle Collection Été Beauty Brand',
      description: 'Présentez notre nouvelle collection de produits de beauté été 2024. Focus sur les produits naturels et leur application.',
      requirements: '- Présenter au moins 2 produits\n- Montrer l\'application/utilisation\n- Mentionner les ingrédients naturels\n- Hashtags: #BeautyBrand #NaturalBeauty #Summer2024',
      videoUrl: 'https://youtube.com/watch?v=example2',
      thumbnailUrl: 'https://example.com/thumbnail2.jpg',
      status: CampaignStatus.ACTIVE,
      budget: 8000.00,
      remainingBudget: 7500.00,
      paymentRatio: 0.6, // 60% on approval, 40% after 7 days
      pricePerClip: 150.00,
      targetPlatforms: [Platform.TIKTOK, Platform.INSTAGRAM_REELS, Platform.YOUTUBE_SHORTS],
      targetLanguages: [Language.FR, Language.EN],
      targetCountries: ['FR', 'BE', 'CH', 'LU'],
      minFollowers: 10000,
      maxClippers: 40,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // +45 days
      totalViews: 50000,
      totalLikes: 4500,
      totalShares: 800,
      totalSubmissions: 5,
      approvedSubmissions: 3,
      tags: {
        create: [
          { tag: 'beauty' },
          { tag: 'cosmetics' },
          { tag: 'natural' },
          { tag: 'summer' },
          { tag: 'skincare' }
        ]
      }
    },
    include: {
      tags: true
    }
  })

  const campaign3 = await prisma.campaign.create({
    data: {
      advertiserId: advertiser1.id,
      title: 'Challenge TechCorp Innovation',
      description: 'Participez à notre challenge créatif ! Montrez comment notre technologie améliore votre quotidien.',
      requirements: '- Créativité et originalité\n- Utilisation du produit dans un contexte réel\n- Durée: 20-40 secondes\n- Hashtags: #TechCorpChallenge #InnovateTogether',
      status: CampaignStatus.DRAFT,
      budget: 3000.00,
      remainingBudget: 3000.00,
      paymentRatio: 0.5,
      pricePerClip: 75.00,
      targetPlatforms: [Platform.TIKTOK],
      targetLanguages: [Language.FR],
      targetCountries: ['FR'],
      minFollowers: 1000,
      maxClippers: 30,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // +37 days
      tags: {
        create: [
          { tag: 'challenge' },
          { tag: 'tech' },
          { tag: 'creative' }
        ]
      }
    },
    include: {
      tags: true
    }
  })

  // Create test submissions
  console.log('📹 Creating test submissions...')

  const submission1 = await prisma.submission.create({
    data: {
      campaignId: campaign1.id,
      clipperId: clipper1.id,
      status: SubmissionStatus.APPROVED,
      clipUrl: 'https://tiktok.com/@jeanclips/video/123456',
      platform: Platform.TIKTOK,
      thumbnailUrl: 'https://example.com/submission1_thumb.jpg',
      description: 'Découvrez la nouvelle app TechCorp qui révolutionne votre quotidien ! 🚀',
      views: 25000,
      likes: 1800,
      shares: 250,
      comments: 120,
      amountEarned: 100.00,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // -5 days
      approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // -4 days
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // -4 days
      reviewerNotes: 'Excellent travail, contenu de qualité',
      metrics: {
        create: [
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            views: 10000,
            likes: 800,
            shares: 100,
            comments: 50
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            views: 18000,
            likes: 1400,
            shares: 180,
            comments: 90
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            views: 25000,
            likes: 1800,
            shares: 250,
            comments: 120
          }
        ]
      }
    }
  })

  const submission2 = await prisma.submission.create({
    data: {
      campaignId: campaign1.id,
      clipperId: clipper2.id,
      status: SubmissionStatus.APPROVED,
      clipUrl: 'https://instagram.com/reel/abcdef',
      platform: Platform.INSTAGRAM_REELS,
      thumbnailUrl: 'https://example.com/submission2_thumb.jpg',
      description: 'TechCorp App: l\'innovation à portée de main ! ✨ #TechCorpApp',
      views: 35000,
      likes: 2500,
      shares: 400,
      comments: 200,
      amountEarned: 100.00,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // -3 days
      approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 days
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 days
      reviewerNotes: 'Très créatif et engageant'
    }
  })

  const submission3 = await prisma.submission.create({
    data: {
      campaignId: campaign2.id,
      clipperId: clipper2.id,
      status: SubmissionStatus.PENDING,
      clipUrl: 'https://tiktok.com/@mariecreator/video/789012',
      platform: Platform.TIKTOK,
      thumbnailUrl: 'https://example.com/submission3_thumb.jpg',
      description: 'Ma routine beauté avec les nouveaux produits Beauty Brand 💄',
      views: 5000,
      likes: 450,
      shares: 50,
      comments: 30,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // -1 day
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // -1 day
    }
  })

  const submission4 = await prisma.submission.create({
    data: {
      campaignId: campaign2.id,
      clipperId: clipper1.id,
      status: SubmissionStatus.REJECTED,
      clipUrl: 'https://youtube.com/shorts/xyz123',
      platform: Platform.YOUTUBE_SHORTS,
      thumbnailUrl: 'https://example.com/submission4_thumb.jpg',
      description: 'Test produits Beauty Brand',
      views: 1000,
      likes: 50,
      shares: 5,
      comments: 3,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 days
      rejectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // -1 day
      reviewerNotes: 'Ne respecte pas les guidelines de la campagne',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // -2 days
    }
  })

  // Create transactions for approved submissions
  console.log('💰 Creating test transactions...')

  await prisma.transaction.createMany({
    data: [
      {
        userId: clipper1.id,
        type: TransactionType.CAMPAIGN_PAYMENT,
        status: TransactionStatus.COMPLETED,
        amount: 50.00, // 50% of 100€
        currency: 'EUR',
        campaignId: campaign1.id,
        submissionId: submission1.id,
        description: 'Paiement initial - Campagne: Lancement App Mobile TechCorp',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        userId: clipper2.id,
        type: TransactionType.CAMPAIGN_PAYMENT,
        status: TransactionStatus.COMPLETED,
        amount: 50.00, // 50% of 100€
        currency: 'EUR',
        campaignId: campaign1.id,
        submissionId: submission2.id,
        description: 'Paiement initial - Campagne: Lancement App Mobile TechCorp',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: advertiser1.id,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        amount: 5000.00,
        currency: 'EUR',
        description: 'Dépôt initial pour campagnes',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        userId: advertiser2.id,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        amount: 10000.00,
        currency: 'EUR',
        description: 'Dépôt initial pour campagnes',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ]
  })

  // Create reviews
  console.log('⭐ Creating test reviews...')

  await prisma.review.createMany({
    data: [
      {
        authorId: advertiser1.id,
        targetUserId: clipper1.id,
        campaignId: campaign1.id,
        rating: 5,
        comment: 'Excellent travail, très professionnel et créatif !',
        isPublic: true
      },
      {
        authorId: advertiser1.id,
        targetUserId: clipper2.id,
        campaignId: campaign1.id,
        rating: 5,
        comment: 'Contenu de grande qualité, parfaitement aligné avec nos attentes.',
        isPublic: true
      },
      {
        authorId: clipper1.id,
        targetUserId: advertiser1.id,
        rating: 4,
        comment: 'Campagne bien organisée, paiements rapides.',
        isPublic: true
      }
    ]
  })

  // Create notifications
  console.log('🔔 Creating test notifications...')

  await prisma.notification.createMany({
    data: [
      {
        userId: clipper1.id,
        type: NotificationType.SUBMISSION_STATUS,
        title: 'Soumission approuvée',
        message: 'Votre soumission pour la campagne "Lancement App Mobile TechCorp" a été approuvée !',
        data: { submissionId: submission1.id, campaignId: campaign1.id }
      },
      {
        userId: clipper2.id,
        type: NotificationType.SUBMISSION_STATUS,
        title: 'Soumission approuvée',
        message: 'Votre soumission pour la campagne "Lancement App Mobile TechCorp" a été approuvée !',
        data: { submissionId: submission2.id, campaignId: campaign1.id }
      },
      {
        userId: clipper1.id,
        type: NotificationType.PAYMENT_RECEIVED,
        title: 'Paiement reçu',
        message: 'Vous avez reçu 50.00€ pour votre clip approuvé.',
        data: { amount: 50.00, campaignId: campaign1.id }
      },
      {
        userId: clipper2.id,
        type: NotificationType.PAYMENT_RECEIVED,
        title: 'Paiement reçu',
        message: 'Vous avez reçu 50.00€ pour votre clip approuvé.',
        data: { amount: 50.00, campaignId: campaign1.id }
      },
      {
        userId: advertiser2.id,
        type: NotificationType.CAMPAIGN_NEW,
        title: 'Nouvelle soumission',
        message: 'Vous avez reçu une nouvelle soumission pour votre campagne "Nouvelle Collection Été Beauty Brand".',
        data: { submissionId: submission3.id, campaignId: campaign2.id }
      }
    ]
  })

  // Create favorite clippers
  console.log('❤️ Creating favorite relationships...')

  await prisma.favoriteClipper.createMany({
    data: [
      {
        advertiserId: advertiser1.id,
        clipperId: clipper1.id,
        note: 'Excellent créateur, travail de qualité constante'
      },
      {
        advertiserId: advertiser1.id,
        clipperId: clipper2.id,
        note: 'Très créative, parfaite pour nos campagnes lifestyle'
      },
      {
        advertiserId: advertiser2.id,
        clipperId: clipper2.id,
        note: 'Spécialiste beauté, audience parfaite pour nos produits'
      }
    ]
  })

  // Create system configuration
  console.log('⚙️ Creating system configuration...')

  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'subscription_plans',
        value: {
          basic: { price: 8, name: 'Basic', maxCampaigns: 3, maxSubmissions: 50 },
          pro: { price: 20, name: 'Pro', maxCampaigns: 10, maxSubmissions: 200 },
          goat: { price: 50, name: 'GOAT', maxCampaigns: -1, maxSubmissions: -1 }
        },
        description: 'Configuration des plans d\'abonnement'
      },
      {
        key: 'commission_rates',
        value: {
          basic: 0.15,
          pro: 0.10,
          goat: 0.05
        },
        description: 'Taux de commission par plan'
      },
      {
        key: 'platform_settings',
        value: {
          minWithdrawal: 50,
          maxWithdrawal: 5000,
          withdrawalProcessingDays: 3,
          supportEmail: 'support@clipbox.com',
          maintenanceMode: false
        },
        description: 'Paramètres généraux de la plateforme'
      }
    ]
  })

  console.log('✅ Database seeding completed successfully!')
  
  // Display summary
  console.log('\n📊 Summary:')
  console.log('- Users created: 5 (1 admin, 2 clippers, 2 advertisers)')
  console.log('- Campaigns created: 3')
  console.log('- Submissions created: 4')
  console.log('- Transactions created: 4')
  console.log('- Reviews created: 3')
  console.log('- Notifications created: 5')
  
  console.log('\n🔑 Test accounts:')
  console.log('- Admin: admin@clipbox.com')
  console.log('- Clipper 1: clipper1@test.com')
  console.log('- Clipper 2: clipper2@test.com')
  console.log('- Advertiser 1: advertiser1@test.com (Pro plan)')
  console.log('- Advertiser 2: advertiser2@test.com (GOAT plan)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })