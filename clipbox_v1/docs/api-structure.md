# Structure des API Clipbox

## Vue d'ensemble

L'API Clipbox suit les principes RESTful avec une architecture modulaire utilisant Next.js App Router. Toutes les routes API sont préfixées par `/api` et organisées par domaine fonctionnel.

## Architecture des API Routes

```
src/app/api/
├── auth/                    # Authentification
│   ├── [...nextauth]/      # NextAuth.js endpoints
│   ├── register/           # Inscription
│   ├── verify-email/       # Vérification email
│   └── forgot-password/    # Récupération mot de passe
├── users/                   # Gestion utilisateurs
│   ├── profile/            # Profil utilisateur
│   ├── settings/           # Paramètres
│   ├── kyc/                # KYC Veriff
│   └── [id]/               # Opérations par ID
├── campaigns/               # Gestion campagnes
│   ├── create/             # Création
│   ├── [id]/               # CRUD par ID
│   ├── search/             # Recherche
│   └── analytics/          # Statistiques
├── submissions/             # Gestion soumissions
│   ├── submit/             # Nouvelle soumission
│   ├── [id]/               # CRUD par ID
│   ├── review/             # Review/Validation
│   └── metrics/            # Métriques
├── payments/                # Paiements
│   ├── stripe/             # Webhooks Stripe
│   ├── balance/            # Gestion balance
│   ├── withdraw/           # Retraits
│   └── transactions/       # Historique
├── subscriptions/           # Abonnements
│   ├── plans/              # Plans disponibles
│   ├── checkout/           # Checkout Stripe
│   ├── manage/             # Gestion abonnement
│   └── cancel/             # Annulation
├── notifications/           # Notifications
│   ├── list/               # Liste notifications
│   ├── mark-read/          # Marquer comme lu
│   └── preferences/        # Préférences
├── social/                  # Réseaux sociaux
│   ├── connect/            # Connexion compte
│   ├── disconnect/         # Déconnexion
│   └── sync/               # Synchronisation
├── admin/                   # Administration
│   ├── users/              # Gestion users
│   ├── campaigns/          # Modération
│   ├── analytics/          # Analytics globales
│   └── config/             # Configuration système
└── webhooks/                # Webhooks externes
    ├── stripe/             # Stripe events
    ├── veriff/             # Veriff KYC
    └── social/             # Social media callbacks
```

## Endpoints Détaillés

### Authentication & Authorization

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Request Body:**
```typescript
{
  email: string
  password: string
  name: string
  role: "CLIPPER" | "ADVERTISER"
  acceptTerms: boolean
}
```

**Response:**
```typescript
{
  success: boolean
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  message?: string
}
```

#### POST `/api/auth/[...nextauth]`
Endpoints NextAuth.js pour OAuth et sessions.
- `/api/auth/signin` - Connexion
- `/api/auth/signout` - Déconnexion
- `/api/auth/session` - Session actuelle
- `/api/auth/providers` - Providers disponibles
- `/api/auth/callback/*` - OAuth callbacks

### User Management

#### GET `/api/users/profile`
Récupère le profil de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  id: string
  email: string
  name: string
  role: string
  profile: {
    bio: string
    website: string
    location: string
    totalEarnings?: number  // Clipper only
    totalClips?: number     // Clipper only
    averageRating?: number  // Clipper only
  }
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: string
  }
}
```

#### PUT `/api/users/profile`
Met à jour le profil utilisateur.

**Request Body:**
```typescript
{
  name?: string
  bio?: string
  website?: string
  location?: string
  phone?: string
  company?: string      // Advertiser only
  vatNumber?: string    // Advertiser only
}
```

#### POST `/api/users/kyc/initiate`
Initie le processus KYC avec Veriff.

**Response:**
```typescript
{
  sessionId: string
  sessionUrl: string  // URL Veriff pour vérification
  expiresAt: string
}
```

### Campaign Management

#### GET `/api/campaigns`
Liste les campagnes avec filtres et pagination.

**Query Parameters:**
```
?status=ACTIVE,PAUSED
&platform=TIKTOK,INSTAGRAM_REELS
&minBudget=100
&maxBudget=5000
&page=1
&limit=20
&sort=createdAt:desc
```

**Response:**
```typescript
{
  campaigns: Campaign[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

#### POST `/api/campaigns/create`
Crée une nouvelle campagne (Annonceurs uniquement).

**Request Body:**
```typescript
{
  title: string
  description: string
  requirements: string
  videoUrl?: string
  budget: number
  paymentRatio: number  // 0.5 = 50% upfront, 50% after 7 days
  pricePerClip: number
  targetPlatforms: Platform[]
  targetLanguages: Language[]
  targetCountries?: string[]
  minFollowers?: number
  maxClippers?: number
  startDate: string
  endDate: string
  tags?: string[]
}
```

#### GET `/api/campaigns/[id]`
Récupère les détails d'une campagne.

**Response:**
```typescript
{
  id: string
  title: string
  description: string
  advertiser: {
    id: string
    name: string
    image: string
  }
  budget: number
  remainingBudget: number
  status: string
  submissions: {
    total: number
    approved: number
    pending: number
  }
  analytics: {
    totalViews: number
    totalLikes: number
    totalShares: number
    engagementRate: number
  }
  // ... autres champs
}
```

#### PUT `/api/campaigns/[id]`
Met à jour une campagne (Annonceur propriétaire uniquement).

#### DELETE `/api/campaigns/[id]`
Supprime/Archive une campagne.

#### GET `/api/campaigns/[id]/analytics`
Récupère les analytics détaillées d'une campagne.

**Response:**
```typescript
{
  overview: {
    totalViews: number
    totalEngagement: number
    conversionRate: number
    roi: number
  }
  timeline: {
    date: string
    views: number
    likes: number
    shares: number
    submissions: number
  }[]
  topPerformers: {
    clipperId: string
    clipperName: string
    views: number
    engagement: number
  }[]
  platformBreakdown: {
    platform: string
    views: number
    engagement: number
  }[]
}
```

### Submission Management

#### POST `/api/submissions/submit`
Soumet un clip pour une campagne (Clippers uniquement).

**Request Body:**
```typescript
{
  campaignId: string
  clipUrl: string
  platform: Platform
  description?: string
  publishedAt: string
}
```

#### GET `/api/submissions`
Liste les soumissions de l'utilisateur.

**Query Parameters:**
```
?role=clipper|advertiser
&status=PENDING,APPROVED
&campaignId=xxx
&page=1
&limit=20
```

#### PUT `/api/submissions/[id]/review`
Review une soumission (Annonceur uniquement).

**Request Body:**
```typescript
{
  status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED"
  reviewerNotes?: string
  revisionNotes?: string  // Si revision requested
}
```

#### POST `/api/submissions/[id]/metrics`
Met à jour les métriques d'une soumission.

**Request Body:**
```typescript
{
  views: number
  likes: number
  shares: number
  comments: number
}
```

### Payment Management

#### GET `/api/payments/balance`
Récupère la balance de l'utilisateur.

**Response:**
```typescript
{
  available: number
  pending: number
  withdrawn: number
  currency: string
  lastWithdrawal?: string
}
```

#### POST `/api/payments/withdraw`
Initie un retrait (KYC requis).

**Request Body:**
```typescript
{
  amount: number
  method: "BANK_TRANSFER" | "STRIPE"
  bankDetails?: {
    iban: string
    bic: string
    accountHolder: string
  }
}
```

#### GET `/api/payments/transactions`
Historique des transactions.

**Query Parameters:**
```
?type=DEPOSIT,WITHDRAWAL,CAMPAIGN_PAYMENT
&status=COMPLETED,PENDING
&from=2024-01-01
&to=2024-12-31
&page=1
&limit=50
```

**Response:**
```typescript
{
  transactions: {
    id: string
    type: string
    amount: number
    status: string
    description: string
    createdAt: string
    completedAt?: string
  }[]
  summary: {
    totalIn: number
    totalOut: number
    pending: number
  }
}
```

### Subscription Management

#### GET `/api/subscriptions/plans`
Liste les plans d'abonnement disponibles.

**Response:**
```typescript
{
  plans: [
    {
      id: "BASIC"
      name: "Basic"
      price: 8
      currency: "EUR"
      features: string[]
      limits: {
        maxCampaigns: 3
        maxSubmissions: 50
        commissionRate: 0.15
      }
    },
    // PRO, GOAT...
  ]
}
```

#### POST `/api/subscriptions/checkout`
Crée une session Stripe Checkout.

**Request Body:**
```typescript
{
  planId: "BASIC" | "PRO" | "GOAT"
  successUrl: string
  cancelUrl: string
}
```

**Response:**
```typescript
{
  checkoutUrl: string
  sessionId: string
}
```

#### POST `/api/subscriptions/cancel`
Annule l'abonnement à la fin de la période.

### Notifications

#### GET `/api/notifications`
Liste les notifications de l'utilisateur.

**Query Parameters:**
```
?unreadOnly=true
&type=CAMPAIGN_NEW,PAYMENT_RECEIVED
&limit=20
```

#### PUT `/api/notifications/mark-read`
Marque des notifications comme lues.

**Request Body:**
```typescript
{
  notificationIds: string[]  // ou "all" pour tout marquer
}
```

### Social Media Integration

#### POST `/api/social/connect`
Connecte un compte de réseau social.

**Request Body:**
```typescript
{
  platform: "TIKTOK" | "INSTAGRAM" | "YOUTUBE"
  redirectUrl: string
}
```

**Response:**
```typescript
{
  authUrl: string  // URL OAuth du réseau social
}
```

#### DELETE `/api/social/disconnect`
Déconnecte un compte social.

**Request Body:**
```typescript
{
  platform: "TIKTOK" | "INSTAGRAM" | "YOUTUBE"
}
```

#### POST `/api/social/sync`
Synchronise les métriques des réseaux sociaux.

### Admin Endpoints

#### GET `/api/admin/users`
Liste tous les utilisateurs (Super Admin uniquement).

**Query Parameters:**
```
?role=CLIPPER,ADVERTISER
&status=ACTIVE,BANNED
&kycStatus=APPROVED,PENDING
&search=john
&page=1
&limit=50
```

#### PUT `/api/admin/users/[id]/ban`
Bannit/Débannit un utilisateur.

**Request Body:**
```typescript
{
  action: "BAN" | "UNBAN"
  reason?: string
}
```

#### GET `/api/admin/analytics`
Analytics globales de la plateforme.

**Response:**
```typescript
{
  users: {
    total: number
    clippers: number
    advertisers: number
    newThisMonth: number
  }
  campaigns: {
    total: number
    active: number
    totalBudget: number
  }
  revenue: {
    subscriptions: number
    commissions: number
    total: number
    mrr: number
  }
  growth: {
    date: string
    users: number
    revenue: number
  }[]
}
```

### Webhooks

#### POST `/api/webhooks/stripe`
Webhook Stripe pour les événements de paiement.

**Headers:**
```
stripe-signature: <signature>
```

**Events gérés:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.failed`
- `transfer.created`

#### POST `/api/webhooks/veriff`
Webhook Veriff pour les mises à jour KYC.

**Request Body:**
```typescript
{
  verification: {
    id: string
    sessionId: string
    status: string
    code: number
    reason?: string
  }
}
```

## Middleware et Intercepteurs

### Authentication Middleware
```typescript
// middleware/auth.ts
export async function withAuth(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  return session
}
```

### Role-Based Access Control
```typescript
// middleware/rbac.ts
export function requireRole(...roles: UserRole[]) {
  return async (req: NextRequest) => {
    const session = await withAuth(req)
    
    if (!roles.includes(session.user.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }
    
    return session
  }
}
```

### Rate Limiting
```typescript
// middleware/rateLimit.ts
const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

export async function withRateLimit(req: NextRequest) {
  const ip = req.ip || "127.0.0.1"
  
  try {
    await rateLimiter.consume(ip)
  } catch {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }
}
```

### Request Validation
```typescript
// middleware/validation.ts
import { z } from "zod"

export function validateBody(schema: z.ZodSchema) {
  return async (req: NextRequest) => {
    const body = await req.json()
    
    try {
      const validated = schema.parse(body)
      return validated
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body", details: error },
        { status: 400 }
      )
    }
  }
}
```

## Error Handling

### Standard Error Response
```typescript
{
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details?: any,
    timestamp: "2024-01-01T00:00:00Z"
  }
}
```

### Error Codes
```typescript
enum ErrorCode {
  // Authentication
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  
  // Authorization
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  
  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // Business Logic
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  CAMPAIGN_BUDGET_EXCEEDED = "CAMPAIGN_BUDGET_EXCEEDED",
  KYC_REQUIRED = "KYC_REQUIRED",
  SUBSCRIPTION_REQUIRED = "SUBSCRIPTION_REQUIRED",
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  
  // System
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"
}
```

## API Versioning

### Strategy
- Version dans l'URL: `/api/v1/`, `/api/v2/`
- Sunset headers pour dépréciation
- Migration progressive des clients

### Headers
```
X-API-Version: 1.0
X-API-Deprecation-Date: 2024-12-31
X-API-Sunset-Date: 2025-03-31
```

## Documentation API

### OpenAPI/Swagger
```yaml
openapi: 3.0.0
info:
  title: Clipbox API
  version: 1.0.0
  description: API pour la plateforme Clipbox
servers:
  - url: https://api.clipbox.com/v1
    description: Production
  - url: https://staging-api.clipbox.com/v1
    description: Staging
```

### Postman Collection
- Collection publique avec tous les endpoints
- Environnements pour dev/staging/prod
- Tests automatisés inclus

## Testing

### Unit Tests
```typescript
// __tests__/api/campaigns.test.ts
describe("POST /api/campaigns/create", () => {
  it("should create a campaign for advertiser", async () => {
    const response = await POST("/api/campaigns/create", {
      headers: { Authorization: `Bearer ${advertiserToken}` },
      body: validCampaignData
    })
    
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })
  
  it("should reject for clipper role", async () => {
    const response = await POST("/api/campaigns/create", {
      headers: { Authorization: `Bearer ${clipperToken}` },
      body: validCampaignData
    })
    
    expect(response.status).toBe(403)
  })
})
```

### Integration Tests
```typescript
// __tests__/integration/payment-flow.test.ts
describe("Payment Flow", () => {
  it("should complete full payment cycle", async () => {
    // 1. Create campaign
    // 2. Submit clip
    // 3. Approve submission
    // 4. Verify payment created
    // 5. Check balance updated
  })
})
```

## Performance Optimizations

### Caching Strategy
```typescript
// Cache headers
headers: {
  "Cache-Control": "public, max-age=3600", // 1 hour
  "CDN-Cache-Control": "max-age=86400",    // 1 day on CDN
  "Stale-While-Revalidate": "86400"
}
```

### Database Query Optimization
- Use select specific fields
- Implement cursor-based pagination
- Add appropriate indexes
- Use connection pooling

### Response Compression
```typescript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
}
```

## Security Best Practices

### Headers
```typescript
// Security headers
headers: {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000",
  "Content-Security-Policy": "default-src 'self'"
}
```

### Input Sanitization
- XSS prevention with DOMPurify
- SQL injection prevention with Prisma
- File upload validation
- Rate limiting per endpoint

### API Keys Management
- Environment variables for secrets
- Rotate keys regularly
- Use different keys per environment
- Audit API key usage