// create-test-user.ts

import { prisma } from "./src/lib/prisma.js";
import bcrypt from "bcryptjs";

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@clipbox.com" },
    });

    if (existingUser) {
      console.log("Test user already exists!");
      return;
    }

    // Create test user with hashed password
    const hashedPassword = await bcrypt.hash("testpassword123", 12);
    
    const testUser = await prisma.user.create({
      data: {
        email: "test@clipbox.com",
        password: hashedPassword,
        name: "Test User",
        role: "CLIPPER",
        emailVerified: new Date(),
        profile: {
          create: {
            bio: "This is a test user account",
            notifyEmail: true,
            notifyPush: true,
            publicProfile: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log("✅ Test user created successfully!");
    console.log("Email: test@clipbox.com");
    console.log("Password: testpassword123");
    console.log("Role: CLIPPER");
    console.log("User ID:", testUser.id);
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();