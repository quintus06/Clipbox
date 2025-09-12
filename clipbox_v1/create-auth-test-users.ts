// create-auth-test-users.ts
// Script pour créer les comptes de test pour l'authentification

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log("🔄 Création des comptes de test...");

    // Mot de passe hashé pour tous les comptes de test
    const hashedPasswordTest = await bcrypt.hash("testpassword123", 12);
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 12);
    const hashedPasswordAdvertiser = await bcrypt.hash("advertiser123", 12);

    // 1. Vérifier/Créer le compte CLIPPER
    const existingClipper = await prisma.user.findUnique({
      where: { email: "test@clipbox.com" },
    });

    if (!existingClipper) {
      const clipper = await prisma.user.create({
        data: {
          email: "test@clipbox.com",
          password: hashedPasswordTest,
          name: "Test Clipper",
          role: "CLIPPER",
          emailVerified: new Date(),
          isActive: true,
          profile: {
            create: {
              bio: "Compte de test pour les clippers",
              totalClips: 0,
              totalEarnings: 0,
              averageRating: 0,
              notifyEmail: true,
              notifyPush: true,
              publicProfile: true,
            },
          },
        },
      });
      console.log("✅ Compte CLIPPER créé:", clipper.email);
    } else {
      // Mettre à jour le mot de passe si le compte existe déjà
      await prisma.user.update({
        where: { email: "test@clipbox.com" },
        data: { password: hashedPasswordTest },
      });
      console.log("✅ Compte CLIPPER existant mis à jour:", existingClipper.email);
    }

    // 2. Créer le compte SUPER_ADMIN
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@clipbox.com" },
    });

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: "admin@clipbox.com",
          password: hashedPasswordAdmin,
          name: "Admin Clipbox",
          role: "SUPER_ADMIN",
          emailVerified: new Date(),
          isActive: true,
          profile: {
            create: {
              bio: "Administrateur de la plateforme Clipbox",
              company: "Clipbox",
              notifyEmail: true,
              notifyPush: true,
              publicProfile: false,
            },
          },
        },
      });
      console.log("✅ Compte SUPER_ADMIN créé:", admin.email);
    } else {
      await prisma.user.update({
        where: { email: "admin@clipbox.com" },
        data: { 
          password: hashedPasswordAdmin,
          role: "SUPER_ADMIN"
        },
      });
      console.log("✅ Compte SUPER_ADMIN existant mis à jour:", existingAdmin.email);
    }

    // 3. Créer le compte ADVERTISER
    const existingAdvertiser = await prisma.user.findUnique({
      where: { email: "advertiser@clipbox.com" },
    });

    if (!existingAdvertiser) {
      const advertiser = await prisma.user.create({
        data: {
          email: "advertiser@clipbox.com",
          password: hashedPasswordAdvertiser,
          name: "Test Advertiser",
          role: "ADVERTISER",
          emailVerified: new Date(),
          isActive: true,
          profile: {
            create: {
              bio: "Compte de test pour les annonceurs",
              company: "Test Company",
              vatNumber: "FR12345678901",
              siret: "12345678901234",
              notifyEmail: true,
              notifyPush: true,
              publicProfile: true,
            },
          },
        },
      });
      console.log("✅ Compte ADVERTISER créé:", advertiser.email);
    } else {
      await prisma.user.update({
        where: { email: "advertiser@clipbox.com" },
        data: { 
          password: hashedPasswordAdvertiser,
          role: "ADVERTISER"
        },
      });
      console.log("✅ Compte ADVERTISER existant mis à jour:", existingAdvertiser.email);
    }

    console.log("\n📋 Récapitulatif des comptes de test:");
    console.log("================================");
    console.log("CLIPPER:");
    console.log("  Email: test@clipbox.com");
    console.log("  Mot de passe: testpassword123");
    console.log("");
    console.log("SUPER_ADMIN:");
    console.log("  Email: admin@clipbox.com");
    console.log("  Mot de passe: admin123");
    console.log("");
    console.log("ADVERTISER:");
    console.log("  Email: advertiser@clipbox.com");
    console.log("  Mot de passe: advertiser123");
    console.log("================================");
    console.log("\n✅ Tous les comptes de test sont prêts!");

  } catch (error) {
    console.error("❌ Erreur lors de la création des comptes de test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createTestUsers();