// test-auth-users.ts
// Script pour tester les utilisateurs et l'authentification

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testUsers() {
  console.log('🔍 Test des utilisateurs dans la base de données\n');
  console.log('=' .repeat(60));

  try {
    // 1. Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📊 Nombre total d'utilisateurs: ${users.length}\n`);

    // 2. Afficher les détails de chaque utilisateur
    for (const user of users) {
      console.log(`\n👤 Utilisateur: ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nom: ${user.name || 'Non défini'}`);
      console.log(`   - Rôle: ${user.role}`);
      console.log(`   - Email vérifié: ${user.emailVerified ? '✅' : '❌'}`);
      console.log(`   - Mot de passe défini: ${user.password ? '✅' : '❌'}`);
      console.log(`   - Créé le: ${user.createdAt.toLocaleString()}`);
      
      // Si c'est un compte de test, vérifier le mot de passe
      if (user.email === 'test@clipbox.com' && user.password) {
        console.log('\n   🔐 Test du mot de passe pour test@clipbox.com:');
        
        // Test avec le mot de passe attendu
        const testPassword = 'testpassword123';
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log(`   - Mot de passe "${testPassword}": ${isValid ? '✅ VALIDE' : '❌ INVALIDE'}`);
        
        // Afficher le hash pour debug
        console.log(`   - Hash stocké: ${user.password.substring(0, 20)}...`);
        
        // Vérifier si c'est un hash bcrypt valide
        const isBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
        console.log(`   - Format bcrypt valide: ${isBcryptHash ? '✅' : '❌'}`);
      }
    }

    // 3. Test de création d'un hash pour référence
    console.log('\n🔧 Test de hashage bcrypt:');
    const testPassword = 'testpassword123';
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log(`   - Hash généré pour "${testPassword}": ${newHash.substring(0, 20)}...`);
    
    // Vérifier que le hash fonctionne
    const verifyHash = await bcrypt.compare(testPassword, newHash);
    console.log(`   - Vérification du nouveau hash: ${verifyHash ? '✅ OK' : '❌ ERREUR'}`);

    // 4. Statistiques par rôle
    console.log('\n📈 Statistiques par rôle:');
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(roleStats).forEach(([role, count]) => {
      console.log(`   - ${role}: ${count} utilisateur(s)`);
    });

    // 5. Utilisateurs sans mot de passe (OAuth uniquement)
    const usersWithoutPassword = users.filter(u => !u.password);
    if (usersWithoutPassword.length > 0) {
      console.log(`\n⚠️  ${usersWithoutPassword.length} utilisateur(s) sans mot de passe (OAuth):`)
      usersWithoutPassword.forEach(u => {
        console.log(`   - ${u.email}`);
      });
    }

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testUsers()
  .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });