// test-auth-redirections.ts
// Script pour tester les redirections après connexion

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TestAccount {
  email: string;
  password: string;
  expectedRedirect: string;
  role: string;
}

const testAccounts: TestAccount[] = [
  {
    email: "test@clipbox.com",
    password: "testpassword123",
    expectedRedirect: "/dashboard/clipper",
    role: "CLIPPER"
  },
  {
    email: "advertiser@clipbox.com",
    password: "advertiser123",
    expectedRedirect: "/dashboard/advertiser",
    role: "ADVERTISER"
  },
  {
    email: "admin@clipbox.com",
    password: "admin123",
    expectedRedirect: "/dashboard/admin",
    role: "SUPER_ADMIN"
  }
];

async function testLogin(account: TestAccount) {
  console.log(`\n🔐 Testing login for ${account.email} (${account.role})...`);
  
  try {
    // Simuler une requête de connexion
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: account.email,
        password: account.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ Login failed for ${account.email}:`, error.error);
      return false;
    }

    const data = await response.json();
    
    // Vérifier la réponse
    console.log(`✅ Login successful for ${account.email}`);
    console.log(`   User role: ${data.user?.role}`);
    console.log(`   Redirect URL: ${data.redirectUrl}`);
    
    // Vérifier que l'URL de redirection est correcte
    if (data.redirectUrl === account.expectedRedirect) {
      console.log(`✅ Correct redirect URL for ${account.role}: ${data.redirectUrl}`);
      return true;
    } else {
      console.error(`❌ Incorrect redirect URL for ${account.role}`);
      console.error(`   Expected: ${account.expectedRedirect}`);
      console.error(`   Got: ${data.redirectUrl}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing ${account.email}:`, error);
    return false;
  }
}

async function verifyUsersExist() {
  console.log("\n📋 Verifying test users exist in database...");
  
  for (const account of testAccounts) {
    const user = await prisma.user.findUnique({
      where: { email: account.email },
      select: { email: true, role: true, name: true }
    });
    
    if (user) {
      console.log(`✅ User found: ${user.email} (${user.role})`);
    } else {
      console.error(`❌ User not found: ${account.email}`);
      console.log(`   Run 'npx tsx create-auth-test-users.ts' to create test users`);
      return false;
    }
  }
  
  return true;
}

async function main() {
  console.log("🚀 Testing Authentication Redirections");
  console.log("=====================================");
  
  // Vérifier que les utilisateurs existent
  const usersExist = await verifyUsersExist();
  if (!usersExist) {
    console.error("\n❌ Some test users are missing. Please create them first.");
    await prisma.$disconnect();
    process.exit(1);
  }
  
  // Tester chaque compte
  console.log("\n🔄 Testing login and redirections...");
  let allTestsPassed = true;
  
  for (const account of testAccounts) {
    const success = await testLogin(account);
    if (!success) {
      allTestsPassed = false;
    }
    
    // Attendre un peu entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Résumé
  console.log("\n📊 Test Summary");
  console.log("===============");
  
  if (allTestsPassed) {
    console.log("✅ All redirection tests passed!");
    console.log("\nRedirections are working correctly:");
    testAccounts.forEach(account => {
      console.log(`  • ${account.email} → ${account.expectedRedirect}`);
    });
  } else {
    console.error("❌ Some tests failed. Check the logs above for details.");
  }
  
  await prisma.$disconnect();
}

// Exécuter les tests
main().catch((error) => {
  console.error("Fatal error:", error);
  prisma.$disconnect();
  process.exit(1);
});