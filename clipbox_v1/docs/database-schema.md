# Schéma de Base de Données Clipbox

## Vue d'ensemble

La base de données Clipbox utilise PostgreSQL via Supabase avec Prisma comme ORM. Le schéma est conçu pour supporter les trois types d'utilisateurs (Clipper, Annonceur, Super Admin) et toutes les fonctionnalités de la plateforme.

## Schéma Prisma Complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== ENUMS ====================

enum UserRole {
  CLIPPER
  ADVERTISER
  SUPER_ADMIN
}

enum SubscriptionPlan {
  BASIC     // 8€/mois
  PRO       // 20€/mois
  GOAT      // 50€/mois
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
  PAUSED
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
  REVISION_REQUESTED
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  CAMPAIGN_PAYMENT
  SUBSCRIPTION_PAYMENT
  REFUND
  BONUS
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

enum KYCStatus {
  NOT_STARTED
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}

enum NotificationType {
  CAMPAIGN_NEW
  SUBMISSION_STATUS
  PAYMENT_RECEIVED
  PAYMENT_SENT
  KYC_UPDATE
  SYSTEM_ANNOUNCEMENT
}

enum Platform {
  TIKTOK
  INSTAGRAM_REELS
  YOUTUBE_SHORTS
}

enum Language {
  FR
  EN
}

// ==================== MODELS ====================

// ---------- User Management ----------

model User {
  id                String      @id @default(cuid())
  email             String      @unique
  emailVerified     DateTime?
  name              String?
  image             String?
  role              UserRole    @default(CLIPPER)
  language          Language    @default(FR)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  lastLoginAt       DateTime?
  isActive          Boolean     @default(true)
  isBanned          Boolean     @default(false)
  bannedAt          DateTime?
  bannedReason      String?
  
  // Relations
  profile           Profile?
  accounts          Account[]
  sessions          Session[]
  subscription      Subscription?
  campaigns         Campaign[]
  submissions       Submission[]
  transactions      Transaction[]
  notifications     Notification[]
  balances          Balance[]
  kycVerification   KYCVerification?
  socialAccounts    SocialAccount[]
  reviews           Review[]
  reviewsGiven      Review[]      @relation("ReviewAuthor")
  favoriteClippers  FavoriteClipper[] @relation("Advertiser")
  favoritedBy       FavoriteClipper[] @relation("Clipper")
  
  @@index([email])
  @@index([role])
  @@index([createdAt])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model Profile {
  id              String    @id @default(cuid())
  userId          String    @unique
  bio             String?   @db.Text
  website         String?
  location        String?
  phone           String?
  dateOfBirth     DateTime?
  company         String?   // Pour les annonceurs
  vatNumber       String?   // Pour les annonceurs
  siret           String?   // Pour les annonceurs (France)
  
  // Statistiques Clipper
  totalEarnings   Decimal   @default(0) @db.Decimal(10, 2)
  totalClips      Int       @default(0)
  averageRating   Float     @default(0)
  
  // Préférences
  notifyEmail     Boolean   @default(true)
  notifyPush      Boolean   @default(true)
  publicProfile   Boolean   @default(true)
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// ---------- Subscription Management ----------

model Subscription {
  id                String             @id @default(cuid())
  userId            String             @unique
  plan              SubscriptionPlan
  status            SubscriptionStatus @default(ACTIVE)
  stripeCustomerId  String?            @unique
  stripeSubscriptionId String?         @unique
  stripePriceId     String?
  currentPeriodStart DateTime
  currentPeriodEnd  DateTime
  cancelAtPeriodEnd Boolean            @default(false)
  cancelledAt       DateTime?
  trialEnd          DateTime?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  // Limites du plan
  maxCampaigns      Int               // Limite de campagnes actives
  maxSubmissions    Int               // Limite de soumissions par mois
  commissionRate    Float             // Taux de commission (ex: 0.10 pour 10%)
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
  @@index([stripeCustomerId])
}

// ---------- Campaign Management ----------

model Campaign {
  id                String         @id @default(cuid())
  advertiserId      String
  title             String
  description       String         @db.Text
  requirements      String         @db.Text
  videoUrl          String?        // URL de la vidéo YouTube source
  thumbnailUrl      String?
  status            CampaignStatus @default(DRAFT)
  
  // Budget et paiement
  budget            Decimal        @db.Decimal(10, 2)
  remainingBudget   Decimal        @db.Decimal(10, 2)
  paymentRatio      Float          // Ex: 0.5 pour 50% à l'approbation, 50% après 7 jours
  pricePerClip      Decimal        @db.Decimal(10, 2)
  
  // Ciblage
  targetPlatforms   Platform[]
  targetLanguages   Language[]
  targetCountries   String[]       // Codes pays ISO
  minFollowers      Int?
  maxClippers       Int?           // Nombre max de clippers
  
  // Dates
  startDate         DateTime
  endDate           DateTime
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  // Statistiques
  totalViews        Int            @default(0)
  totalLikes        Int            @default(0)
  totalShares       Int            @default(0)
  totalSubmissions  Int            @default(0)
  approvedSubmissions Int          @default(0)
  
  // Relations
  advertiser        User           @relation(fields: [advertiserId], references: [id])
  submissions       Submission[]
  tags              CampaignTag[]
  
  @@index([advertiserId])
  @@index([status])
  @@index([startDate])
  @@index([endDate])
  @@index([createdAt])
}

model CampaignTag {
  id          String   @id @default(cuid())
  campaignId  String
  tag         String
  
  campaign    Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  
  @@unique([campaignId, tag])
  @@index([tag])
}

// ---------- Submission Management ----------

model Submission {
  id              String           @id @default(cuid())
  campaignId      String
  clipperId       String
  status          SubmissionStatus @default(PENDING)
  
  // Contenu
  clipUrl         String           // URL du clip publié
  platform        Platform
  thumbnailUrl    String?
  description     String?          @db.Text
  
  // Métriques (mises à jour périodiquement)
  views           Int              @default(0)
  likes           Int              @default(0)
  shares          Int              @default(0)
  comments        Int              @default(0)
  lastMetricsUpdate DateTime?
  
  // Paiement
  amountEarned    Decimal?         @db.Decimal(10, 2)
  paidAt          DateTime?
  paymentId       String?
  
  // Feedback
  reviewerNotes   String?          @db.Text
  revisionNotes   String?          @db.Text
  
  // Dates
  submittedAt     DateTime         @default(now())
  approvedAt      DateTime?
  rejectedAt      DateTime?
  publishedAt     DateTime?
  
  // Relations
  campaign        Campaign         @relation(fields: [campaignId], references: [id])
  clipper         User             @relation(fields: [clipperId], references: [id])
  metrics         SubmissionMetric[]
  
  @@index([campaignId])
  @@index([clipperId])
  @@index([status])
  @@index([submittedAt])
}

model SubmissionMetric {
  id           String     @id @default(cuid())
  submissionId String
  date         DateTime
  views        Int
  likes        Int
  shares       Int
  comments     Int
  
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  
  @@unique([submissionId, date])
  @@index([date])
}

// ---------- Financial Management ----------

model Balance {
  id              String   @id @default(cuid())
  userId          String
  currency        String   @default("EUR")
  available       Decimal  @default(0) @db.Decimal(10, 2)
  pending         Decimal  @default(0) @db.Decimal(10, 2)
  withdrawn       Decimal  @default(0) @db.Decimal(10, 2)
  lastWithdrawal  DateTime?
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, currency])
  @@index([userId])
}

model Transaction {
  id              String            @id @default(cuid())
  userId          String
  type            TransactionType
  status          TransactionStatus @default(PENDING)
  amount          Decimal           @db.Decimal(10, 2)
  currency        String            @default("EUR")
  description     String?
  
  // Références
  campaignId      String?
  submissionId    String?
  stripePaymentId String?
  stripeTransferId String?
  
  // Métadonnées
  metadata        Json?
  failureReason   String?
  
  // Dates
  createdAt       DateTime          @default(now())
  completedAt     DateTime?
  
  user            User              @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([type])
  @@index([status])
  @@index([createdAt])
}

// ---------- KYC Management ----------

model KYCVerification {
  id                String    @id @default(cuid())
  userId            String    @unique
  status            KYCStatus @default(NOT_STARTED)
  veriffSessionId   String?   @unique
  veriffSessionUrl  String?
  
  // Documents
  idDocumentType    String?   // passport, id_card, driver_license
  idDocumentNumber  String?
  idDocumentExpiry  DateTime?
  
  // Données personnelles (chiffrées)
  firstName         String?
  lastName          String?
  dateOfBirth       DateTime?
  nationality       String?
  address           String?
  city              String?
  postalCode        String?
  country           String?
  
  // Résultat
  verificationCode  String?
  reasonCode        String?
  comments          String?   @db.Text
  
  // Dates
  submittedAt       DateTime?
  verifiedAt        DateTime?
  expiresAt         DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  user              User      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
}

// ---------- Social Media Integration ----------

model SocialAccount {
  id              String   @id @default(cuid())
  userId          String
  platform        Platform
  accountId       String
  username        String
  profileUrl      String
  followers       Int      @default(0)
  isVerified      Boolean  @default(false)
  accessToken     String?  @db.Text
  refreshToken    String?  @db.Text
  tokenExpiry     DateTime?
  lastSync        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  
  @@unique([platform, accountId])
  @@index([userId])
  @@index([platform])
}

// ---------- Review System ----------

model Review {
  id              String   @id @default(cuid())
  authorId        String
  targetUserId    String
  campaignId      String?
  rating          Int      // 1-5
  comment         String?  @db.Text
  isPublic        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  author          User     @relation("ReviewAuthor", fields: [authorId], references: [id])
  targetUser      User     @relation(fields: [targetUserId], references: [id])
  
  @@unique([authorId, targetUserId, campaignId])
  @@index([targetUserId])
  @@index([rating])
}

// ---------- Notification System ----------

model Notification {
  id              String           @id @default(cuid())
  userId          String
  type            NotificationType
  title           String
  message         String           @db.Text
  data            Json?            // Données additionnelles
  isRead          Boolean          @default(false)
  readAt          DateTime?
  createdAt       DateTime         @default(now())
  
  user            User             @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
}

// ---------- Favorites ----------

model FavoriteClipper {
  id              String   @id @default(cuid())
  advertiserId    String
  clipperId       String
  note            String?  @db.Text
  createdAt       DateTime @default(now())
  
  advertiser      User     @relation("Advertiser", fields: [advertiserId], references: [id])
  clipper         User     @relation("Clipper", fields: [clipperId], references: [id])
  
  @@unique([advertiserId, clipperId])
  @@index([advertiserId])
  @@index([clipperId])
}

// ---------- System Configuration ----------

model SystemConfig {
  id              String   @id @default(cuid())
  key             String   @unique
  value           Json
  description     String?
  updatedAt       DateTime @updatedAt
  updatedBy       String?
  
  @@index([key])
}

model AuditLog {
  id              String   @id @default(cuid())
  userId          String?
  action          String
  entity          String
  entityId        String?
  oldValues       Json?
  newValues       Json?
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([entity])
  @@index([createdAt])
}
```

## Relations Clés

### 1. User ↔ Campaign
- Un annonceur peut créer plusieurs campagnes
- Une campagne appartient à un seul annonceur

### 2. Campaign ↔ Submission
- Une campagne peut avoir plusieurs soumissions
- Une soumission est liée à une seule campagne

### 3. User ↔ Submission
- Un clipper peut faire plusieurs soumissions
- Une soumission est faite par un seul clipper

### 4. User ↔ Balance
- Chaque utilisateur a un ou plusieurs balances (multi-devises)
- Une balance appartient à un seul utilisateur

### 5. User ↔ Transaction
- Un utilisateur peut avoir plusieurs transactions
- Une transaction est liée à un seul utilisateur

## Indexes Stratégiques

### Performance Queries
```sql
-- Campagnes actives
CREATE INDEX idx_campaign_active ON "Campaign" (status, "startDate", "endDate");

-- Soumissions en attente
CREATE INDEX idx_submission_pending ON "Submission" (status, "submittedAt");

-- Transactions récentes
CREATE INDEX idx_transaction_recent ON "Transaction" ("userId", "createdAt" DESC);

-- Notifications non lues
CREATE INDEX idx_notification_unread ON "Notification" ("userId", "isRead", "createdAt" DESC);
```

### Full-Text Search
```sql
-- Recherche de campagnes
CREATE INDEX idx_campaign_search ON "Campaign" USING GIN (
  to_tsvector('french', title || ' ' || description)
);

-- Recherche d'utilisateurs
CREATE INDEX idx_user_search ON "User" USING GIN (
  to_tsvector('french', name || ' ' || COALESCE(email, ''))
);
```

## Sécurité et Contraintes

### Row Level Security (RLS)
```sql
-- Les utilisateurs ne peuvent voir que leurs propres données
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_policy ON "User"
  FOR ALL USING (auth.uid() = id OR role = 'SUPER_ADMIN');

-- Les clippers ne voient que les campagnes actives
CREATE POLICY campaign_view_policy ON "Campaign"
  FOR SELECT USING (
    status = 'ACTIVE' OR 
    "advertiserId" = auth.uid() OR
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );
```

### Contraintes Métier
```sql
-- Budget restant ne peut pas être négatif
ALTER TABLE "Campaign" ADD CONSTRAINT positive_remaining_budget 
  CHECK ("remainingBudget" >= 0);

-- Balance disponible ne peut pas être négative
ALTER TABLE "Balance" ADD CONSTRAINT positive_available 
  CHECK (available >= 0);

-- Rating entre 1 et 5
ALTER TABLE "Review" ADD CONSTRAINT valid_rating 
  CHECK (rating >= 1 AND rating <= 5);
```

## Migrations

### Stratégie de Migration
1. **Development**: Auto-migration avec `prisma db push`
2. **Staging**: Migrations versionnées avec `prisma migrate dev`
3. **Production**: Migrations reviewées avec `prisma migrate deploy`

### Exemple de Migration
```sql
-- Migration: Add campaign analytics
ALTER TABLE "Campaign" 
  ADD COLUMN "conversionRate" FLOAT DEFAULT 0,
  ADD COLUMN "engagementRate" FLOAT DEFAULT 0,
  ADD COLUMN "roi" DECIMAL(10, 2) DEFAULT 0;

CREATE INDEX idx_campaign_performance 
  ON "Campaign" ("conversionRate", "engagementRate");
```

## Optimisations

### 1. Partitioning
```sql
-- Partitioning des transactions par mois
CREATE TABLE "Transaction" (
  -- colonnes...
) PARTITION BY RANGE ("createdAt");

CREATE TABLE "Transaction_2024_01" PARTITION OF "Transaction"
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 2. Materialized Views
```sql
-- Vue matérialisée pour les statistiques des clippers
CREATE MATERIALIZED VIEW clipper_stats AS
SELECT 
  u.id,
  COUNT(s.id) as total_submissions,
  AVG(r.rating) as avg_rating,
  SUM(t.amount) as total_earned
FROM "User" u
LEFT JOIN "Submission" s ON u.id = s."clipperId"
LEFT JOIN "Review" r ON u.id = r."targetUserId"
LEFT JOIN "Transaction" t ON u.id = t."userId" AND t.type = 'CAMPAIGN_PAYMENT'
WHERE u.role = 'CLIPPER'
GROUP BY u.id;

-- Refresh toutes les heures
CREATE EXTENSION pg_cron;
SELECT cron.schedule('refresh-clipper-stats', '0 * * * *', 
  'REFRESH MATERIALIZED VIEW CONCURRENTLY clipper_stats');
```

### 3. Connection Pooling
```javascript
// Configuration Prisma pour le pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // URL avec pgbouncer
  directUrl = env("DIRECT_URL")  // Pour les migrations
}
```

## Backup et Recovery

### Stratégie de Backup
- **Continuous Archiving**: WAL archiving toutes les 5 minutes
- **Daily Backups**: Snapshot complet à 3h du matin
- **Point-in-Time Recovery**: Possible jusqu'à 30 jours
- **Geo-Redundancy**: Réplication dans une autre région

### Monitoring
- **Métriques**: Connexions, requêtes lentes, taille DB
- **Alertes**: Espace disque, deadlocks, performance
- **Audit**: Tous les changements de schéma loggés

## Évolutions Futures

### Phase 2
- [ ] Système de messagerie interne
- [ ] Analytics avancées avec TimescaleDB
- [ ] Système de recommandation ML
- [ ] API webhooks pour intégrations

### Phase 3
- [ ] Multi-tenancy pour agences
- [ ] Blockchain pour transparence des paiements
- [ ] GraphQL API
- [ ] Real-time collaboration