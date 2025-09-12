import { prisma } from './src/lib/prisma'
import { 
  getUserByEmail, 
  getActiveCampaigns, 
  getClipperStats,
  searchCampaigns 
} from './src/lib/db-utils'

async function testDatabaseConnection() {
  console.log('🔍 Testing Prisma and Database Configuration...\n')

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic database connection...')
    const userCount = await prisma.user.count()
    console.log(`✅ Connected! Found ${userCount} users in database.\n`)

    // Test 2: Fetch users with relations
    console.log('2️⃣ Testing user queries with relations...')
    const admin = await getUserByEmail('admin@clipbox.com')
    if (admin) {
      console.log(`✅ Admin user found: ${admin.name} (${admin.role})`)
    }

    const clipper = await getUserByEmail('clipper1@test.com')
    if (clipper) {
      console.log(`✅ Clipper found: ${clipper.name}`)
      console.log(`   - Balance: ${clipper.balances[0]?.available}€ available`)
      console.log(`   - Social accounts: ${clipper.socialAccounts?.length || 0}`)
    }

    const advertiser = await getUserByEmail('advertiser1@test.com')
    if (advertiser) {
      console.log(`✅ Advertiser found: ${advertiser.name}`)
      console.log(`   - Subscription: ${advertiser.subscription?.plan} plan`)
      console.log(`   - Status: ${advertiser.subscription?.status}\n`)
    }

    // Test 3: Fetch campaigns
    console.log('3️⃣ Testing campaign queries...')
    const activeCampaigns = await getActiveCampaigns()
    console.log(`✅ Found ${activeCampaigns.length} active campaigns`)
    
    if (activeCampaigns.length > 0) {
      const firstCampaign = activeCampaigns[0]
      console.log(`   - "${firstCampaign.title}"`)
      console.log(`     Budget: ${firstCampaign.budget}€`)
      console.log(`     Submissions: ${firstCampaign._count.submissions}`)
      console.log(`     Tags: ${firstCampaign.tags.map(t => t.tag).join(', ')}\n`)
    }

    // Test 4: Test submissions
    console.log('4️⃣ Testing submission queries...')
    const submissions = await prisma.submission.findMany({
      include: {
        campaign: true,
        clipper: true
      },
      take: 3
    })
    console.log(`✅ Found ${submissions.length} submissions`)
    submissions.forEach(sub => {
      console.log(`   - ${sub.clipper.name} → "${sub.campaign.title}" (${sub.status})`)
    })
    console.log()

    // Test 5: Test transactions
    console.log('5️⃣ Testing transaction queries...')
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true
      },
      take: 3
    })
    console.log(`✅ Found ${transactions.length} transactions`)
    transactions.forEach(tx => {
      console.log(`   - ${tx.user.name}: ${tx.amount}€ (${tx.type} - ${tx.status})`)
    })
    console.log()

    // Test 6: Test clipper statistics
    console.log('6️⃣ Testing statistics utilities...')
    if (clipper) {
      const stats = await getClipperStats(clipper.id)
      console.log(`✅ Clipper statistics for ${clipper.name}:`)
      console.log(`   - Total submissions: ${stats.totalSubmissions}`)
      console.log(`   - Total earnings: ${stats.totalEarnings}€`)
      console.log(`   - Average rating: ${stats.averageRating}/5`)
      console.log(`   - Total reviews: ${stats.totalReviews}\n`)
    }

    // Test 7: Test search functionality
    console.log('7️⃣ Testing search functionality...')
    const searchResults = await searchCampaigns('tech')
    console.log(`✅ Search for "tech" returned ${searchResults.length} campaigns\n`)

    // Test 8: Test system configuration
    console.log('8️⃣ Testing system configuration...')
    const systemConfig = await prisma.systemConfig.findMany()
    console.log(`✅ Found ${systemConfig.length} system configuration entries`)
    systemConfig.forEach(config => {
      console.log(`   - ${config.key}: ${config.description}`)
    })
    console.log()

    // Summary
    console.log('=' .repeat(60))
    console.log('✅ All tests passed successfully!')
    console.log('=' .repeat(60))
    console.log('\n📊 Database Summary:')
    
    const [
      userCount2,
      campaignCount,
      submissionCount,
      transactionCount,
      reviewCount,
      notificationCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.campaign.count(),
      prisma.submission.count(),
      prisma.transaction.count(),
      prisma.review.count(),
      prisma.notification.count()
    ])

    console.log(`   - Users: ${userCount2}`)
    console.log(`   - Campaigns: ${campaignCount}`)
    console.log(`   - Submissions: ${submissionCount}`)
    console.log(`   - Transactions: ${transactionCount}`)
    console.log(`   - Reviews: ${reviewCount}`)
    console.log(`   - Notifications: ${notificationCount}`)

    console.log('\n🎉 Prisma and Supabase are configured and working correctly!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testDatabaseConnection()