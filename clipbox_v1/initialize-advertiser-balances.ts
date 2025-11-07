// Script to initialize Balance records for existing advertiser users
// Run this once to fix existing advertisers who don't have a Balance record

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeAdvertiserBalances() {
  try {
    console.log('Starting balance initialization for existing advertisers...');

    // Find all advertisers
    const advertisers = await prisma.user.findMany({
      where: {
        role: 'ADVERTISER',
      },
      include: {
        balances: true,
      },
    });

    console.log(`Found ${advertisers.length} advertiser users`);

    let initialized = 0;
    let skipped = 0;

    for (const advertiser of advertisers) {
      // Check if advertiser already has a EUR balance
      const hasEurBalance = advertiser.balances.some(
        (balance) => balance.currency === 'EUR'
      );

      if (hasEurBalance) {
        console.log(`✓ Skipping ${advertiser.email} - already has EUR balance`);
        skipped++;
        continue;
      }

      // Create Balance record with 3500 EUR starting balance
      await prisma.balance.create({
        data: {
          userId: advertiser.id,
          currency: 'EUR',
          available: 3500,
          pending: 0,
        },
      });

      console.log(`✓ Initialized balance for ${advertiser.email} with 3500 EUR`);
      initialized++;
    }

    console.log('\n=== Summary ===');
    console.log(`Total advertisers: ${advertisers.length}`);
    console.log(`Balances initialized: ${initialized}`);
    console.log(`Skipped (already had balance): ${skipped}`);
    console.log('\nBalance initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing balances:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
initializeAdvertiserBalances()
  .then(() => {
    console.log('\nScript finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });