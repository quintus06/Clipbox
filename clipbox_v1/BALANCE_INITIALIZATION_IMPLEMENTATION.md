# Balance Initialization Implementation

## Overview
This document describes the implementation of automatic balance initialization for new advertiser users with a 3500 EUR starting balance.

## Problem
New advertiser users were unable to create campaigns because they didn't have a Balance record in the database, resulting in "Balance not initialized" errors.

## Solution
Implemented automatic Balance creation during user registration for ADVERTISER role users.

---

## Changes Made

### 1. Updated Regular Email/Password Registration
**File:** [`src/app/api/auth/register/route.ts`](src/app/api/auth/register/route.ts)

**Changes:**
- Wrapped user creation in a Prisma transaction (`prisma.$transaction`)
- Added Balance creation for ADVERTISER users immediately after user creation
- Balance is created with:
  - `currency`: 'EUR'
  - `available`: 3500 (starting balance)
  - `pending`: 0

**Code:**
```typescript
const user = await prisma.$transaction(async (tx) => {
  const newUser = await tx.user.create({
    data: {
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      role: validatedData.role as any,
      profile: {
        create: {
          company: validatedData.company,
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

  // Create Balance record for ADVERTISER users with 3500 EUR starting balance
  if (validatedData.role === 'ADVERTISER') {
    await tx.balance.create({
      data: {
        userId: newUser.id,
        currency: 'EUR',
        available: 3500,
        pending: 0,
      },
    });
    console.log('[Register] Balance initialized for advertiser:', newUser.email, 'with 3500 EUR');
  }

  return newUser;
});
```

### 2. Updated Google OAuth Registration
**File:** [`src/app/api/auth/google/callback/route.ts`](src/app/api/auth/google/callback/route.ts)

**Changes:**
- Wrapped new user creation in a Prisma transaction
- Added Balance creation for ADVERTISER users during OAuth registration
- Same balance initialization as regular registration (3500 EUR)

**Code:**
```typescript
user = await prisma.$transaction(async (tx) => {
  const newUser = await tx.user.create({
    data: {
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
      role: userRole,
      profile: {
        create: {
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

  // Create Balance record for ADVERTISER users with 3500 EUR starting balance
  if (userRole === 'ADVERTISER') {
    await tx.balance.create({
      data: {
        userId: newUser.id,
        currency: 'EUR',
        available: 3500,
        pending: 0,
      },
    });
    console.log('[Google OAuth] Balance initialized for advertiser:', newUser.email, 'with 3500 EUR');
  }

  return newUser;
});
```

### 3. Created Migration Script for Existing Users
**File:** [`initialize-advertiser-balances.ts`](initialize-advertiser-balances.ts)

**Purpose:**
- One-time script to initialize Balance for existing advertiser users
- Safe to run multiple times (skips users who already have a balance)

**Usage:**
```bash
# Run the migration script
npx tsx clipbox_v1/initialize-advertiser-balances.ts
```

**Features:**
- Finds all users with role ADVERTISER
- Checks if they already have a EUR balance
- Creates Balance record with 3500 EUR for those who don't
- Provides detailed logging and summary

---

## Technical Details

### Database Schema
The Balance model uses a composite unique key:
```prisma
model Balance {
  id              String   @id @default(cuid())
  userId          String
  currency        String   @default("EUR")
  available       Decimal  @default(0) @db.Decimal(10, 2)
  pending         Decimal  @default(0) @db.Decimal(10, 2)
  // ...
  
  @@unique([userId, currency])
}
```

### Transaction Safety
Both registration flows use Prisma transactions to ensure:
- Atomicity: User and Balance are created together or not at all
- Consistency: No partial state if Balance creation fails
- Isolation: No race conditions during concurrent registrations

### Balance Initialization Logic
```typescript
if (userRole === 'ADVERTISER') {
  await tx.balance.create({
    data: {
      userId: newUser.id,
      currency: 'EUR',
      available: 3500,  // Starting balance
      pending: 0,       // No pending transactions
    },
  });
}
```

---

## Testing

### Test New User Registration

#### 1. Test Email/Password Registration
```bash
# Register a new advertiser via the signup form
# Navigate to: http://localhost:3000/auth/signup
# Select "Advertiser" role
# Complete registration
# Check that balance is initialized
```

#### 2. Test Google OAuth Registration
```bash
# Sign up with Google as an advertiser
# Navigate to: http://localhost:3000/auth/signup
# Click "Continue with Google"
# Select "Advertiser" role
# Complete OAuth flow
# Check that balance is initialized
```

#### 3. Verify Balance in Database
```sql
-- Check balance for a specific user
SELECT u.email, u.role, b.currency, b.available, b.pending
FROM "User" u
LEFT JOIN "Balance" b ON u.id = b."userId"
WHERE u.role = 'ADVERTISER'
ORDER BY u."createdAt" DESC;
```

### Test Campaign Creation
```bash
# After registering as advertiser
# Navigate to: http://localhost:3000/dashboard/advertiser/campaigns/new
# Create a new campaign
# Should succeed without "Balance not initialized" error
```

### Run Migration Script for Existing Users
```bash
# Initialize balance for existing advertisers
npx tsx clipbox_v1/initialize-advertiser-balances.ts

# Expected output:
# Starting balance initialization for existing advertisers...
# Found X advertiser users
# ✓ Initialized balance for user@example.com with 3500 EUR
# ...
# === Summary ===
# Total advertisers: X
# Balances initialized: Y
# Skipped (already had balance): Z
```

---

## Rollback Plan

If issues occur, you can:

1. **Remove Balance records created by the script:**
```sql
DELETE FROM "Balance" 
WHERE "userId" IN (
  SELECT id FROM "User" WHERE role = 'ADVERTISER'
) AND "createdAt" > '2025-11-07';  -- Adjust date as needed
```

2. **Revert code changes:**
```bash
git checkout HEAD -- src/app/api/auth/register/route.ts
git checkout HEAD -- src/app/api/auth/google/callback/route.ts
```

---

## Future Considerations

### 1. Configurable Starting Balance
Consider making the starting balance configurable:
```typescript
const ADVERTISER_STARTING_BALANCE = 
  parseFloat(process.env.ADVERTISER_STARTING_BALANCE || '3500');
```

### 2. Welcome Bonus Transaction
Create a transaction record for the initial balance:
```typescript
await tx.transaction.create({
  data: {
    userId: newUser.id,
    type: 'BONUS',
    amount: 3500,
    currency: 'EUR',
    description: 'Welcome bonus for new advertiser',
    status: 'COMPLETED',
  },
});
```

### 3. Email Notification
Send welcome email with balance information:
```typescript
await sendWelcomeEmail(newUser.email, {
  name: newUser.name,
  balance: 3500,
  currency: 'EUR',
});
```

---

## Summary

✅ **Completed:**
- Automatic balance initialization for new advertisers (email/password)
- Automatic balance initialization for new advertisers (Google OAuth)
- Migration script for existing advertisers
- Transaction safety with Prisma transactions
- Comprehensive logging

✅ **Benefits:**
- No more "Balance not initialized" errors
- Seamless onboarding for new advertisers
- Atomic operations ensure data consistency
- Easy to run migration for existing users

✅ **Starting Balance:**
- **3500 EUR** for all new advertiser accounts
- Configurable in the future if needed