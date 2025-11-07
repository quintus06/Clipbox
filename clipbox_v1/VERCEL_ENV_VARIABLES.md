# Environment Variables for Google OAuth

This document explains all required environment variables for Google OAuth authentication and how to configure them properly in Vercel.

## Quick Setup Guide

Go to your Vercel project → **Settings** → **Environment Variables** and add the following variables.

---

## Required Environment Variables

### 1. NEXTAUTH_URL ⚠️ **CRITICAL**
**Purpose:** Base URL of your application. Used to construct OAuth redirect URIs.

**Production Value:**
```
https://clipbox.io
```

**Development Value:**
```
http://localhost:3000
```

**Important Notes:**
- ⚠️ **DO NOT include a trailing slash** (e.g., `https://clipbox.io/` is incorrect)
- This variable is **REQUIRED** in production
- Without this, you'll get `undefined/api/auth/google/callback` errors
- Must be a complete URL with protocol (`https://` or `http://`)

**Vercel Configuration:**
- Set for **Production** environment
- Set for **Preview** environment (use your preview URL)
- Set for **Development** environment (use `http://localhost:3000`)

---

### 2. GOOGLE_CLIENT_ID
**Purpose:** Your Google OAuth 2.0 Client ID from Google Cloud Console.

**Value:**
```
[YOUR_GOOGLE_CLIENT_ID]
```

**How to Get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project "clipbox-468515"
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID

**Vercel Configuration:**
- Set for **Production**, **Preview**, and **Development** environments

---

### 3. GOOGLE_CLIENT_SECRET
**Purpose:** Your Google OAuth 2.0 Client Secret (keep this secure!).

**Value:**
```
[YOUR_GOOGLE_CLIENT_SECRET]
```

**Security Notes:**
- ⚠️ Keep this secret! Never commit to version control
- Only share through secure channels
- Rotate periodically for security

**Vercel Configuration:**
- Set for **Production**, **Preview**, and **Development** environments
- Mark as **Sensitive** in Vercel

---

### 4. GOOGLE_REDIRECT_URI_PROD (Optional)
**Purpose:** Override the default redirect URI for production.

**Value:**
```
https://clipbox.io/api/auth/google/callback
```

**When to Use:**
- Only needed if you want to override the automatic redirect URI construction
- If `NEXTAUTH_URL` is set, this is optional (the system will use `${NEXTAUTH_URL}/api/auth/google/callback`)
- Useful for custom domain configurations

**Vercel Configuration:**
- Set for **Production** environment only

---

### 5. GOOGLE_REDIRECT_URI (Optional)
**Purpose:** Override the default redirect URI for development.

**Value:**
```
http://localhost:3000/api/auth/google/callback
```

**When to Use:**
- Only needed for local development if you want to override the default
- If `NEXTAUTH_URL` is set, this is optional

**Vercel Configuration:**
- Set for **Development** environment only

---

### 6. NEXTAUTH_SECRET (Required for Production)
**Purpose:** Secret key for signing JWT tokens and encrypting session data.

**How to Generate:**
```bash
openssl rand -base64 32
```

**Example Output:**
```
your-generated-secret-here-32-characters-long
```

**Vercel Configuration:**
- Set for **Production**, **Preview**, and **Development** environments
- Mark as **Sensitive** in Vercel
- Use different secrets for different environments

---

## Environment Variable Priority

The system uses the following priority for redirect URIs:

### Production:
1. `GOOGLE_REDIRECT_URI_PROD` (if set)
2. `${NEXTAUTH_URL}/api/auth/google/callback` (if NEXTAUTH_URL is set)
3. ❌ Error if neither is set

### Development:
1. `GOOGLE_REDIRECT_URI` (if set)
2. `${NEXTAUTH_URL}/api/auth/google/callback` (if NEXTAUTH_URL is set)
3. ❌ Error if neither is set

---

## Google Cloud Console Configuration

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project **"clipbox-468515"**
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Configure OAuth 2.0 Client
1. Click on your OAuth 2.0 Client ID
2. Under **"Authorized redirect URIs"**, add:

**Production:**
```
https://clipbox.io/api/auth/google/callback
```

**Development:**
```
http://localhost:3000/api/auth/google/callback
```

**Preview (if using Vercel preview deployments):**
```
https://your-preview-url.vercel.app/api/auth/google/callback
```

### Step 3: Save Changes
Click **"Save"** at the bottom of the page.

---

## Vercel Deployment Steps

### 1. Add Environment Variables
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable listed above
4. Select appropriate environments (Production/Preview/Development)

### 2. Redeploy
After adding variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. ✅ Check **"Use existing Build Cache"** for faster deployment

### 3. Verify
After deployment:
1. Check the deployment logs for validation messages
2. Look for: `✓ Google OAuth environment variables are valid`
3. If you see errors, check the logs for specific missing variables

---

## Troubleshooting

### Error: "redirect_uri shows as undefined/api/auth/google/callback"
**Cause:** `NEXTAUTH_URL` is not set in production environment.

**Solution:**
1. Add `NEXTAUTH_URL=https://clipbox.io` to Vercel environment variables
2. Set it for **Production** environment
3. Redeploy the application

---

### Error: "OAuth configuration error"
**Cause:** One or more required environment variables are missing.

**Solution:**
1. Check Vercel deployment logs for specific missing variables
2. The logs will show: `✗ Google OAuth environment validation failed:`
3. Add the missing variables as listed in the error
4. Redeploy

---

### Error: "redirect_uri_mismatch" from Google
**Cause:** The redirect URI in your request doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check the exact redirect URI in the error message
2. Go to Google Cloud Console → Credentials
3. Add the exact URI to "Authorized redirect URIs"
4. Wait a few minutes for changes to propagate
5. Try again

---

### Error: "État OAuth invalide" (Invalid OAuth state)
**Cause:** State parameter mismatch, possibly due to cookie issues.

**Solution:**
1. Clear browser cookies for your domain
2. Ensure cookies are enabled
3. Check that your domain is properly configured (no mixed HTTP/HTTPS)
4. Try again

---

## Validation System

The application now includes automatic validation of environment variables:

### On Startup
- All OAuth routes validate environment variables before processing requests
- Validation results are logged to console
- Missing variables trigger clear error messages

### Validation Checks
✅ `NEXTAUTH_URL` is set and is a valid URL  
✅ `NEXTAUTH_URL` doesn't end with a trailing slash  
✅ `GOOGLE_CLIENT_ID` is set  
✅ `GOOGLE_CLIENT_SECRET` is set  
✅ Redirect URI can be constructed properly  

### Error Messages
When validation fails, you'll see:
- **Console logs** with specific missing variables
- **User-friendly error** on the signin page
- **Detailed error response** in API responses (500 status)

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env.local` for local development
   - Add `.env.local` to `.gitignore`

2. **Use different secrets per environment**
   - Production should have unique `NEXTAUTH_SECRET`
   - Development can use a different secret

3. **Rotate secrets periodically**
   - Update `GOOGLE_CLIENT_SECRET` every 6-12 months
   - Update `NEXTAUTH_SECRET` if compromised

4. **Limit OAuth scopes**
   - Only request necessary Google scopes
   - Current scopes: `openid email profile`

5. **Monitor OAuth logs**
   - Check Vercel logs regularly
   - Watch for failed authentication attempts
   - Investigate unusual patterns

---

## Testing Locally

### 1. Create `.env.local` file
```bash
# In clipbox_v1 directory
touch .env.local
```

### 2. Add variables
```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
NEXTAUTH_SECRET=your-local-secret-here
```

### 3. Run development server
```bash
npm run dev
```

### 4. Test OAuth flow
1. Go to `http://localhost:3000/auth/signin`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Check console for validation messages

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this documentation
3. Verify all environment variables are set correctly
4. Check Google Cloud Console configuration
5. Contact the development team with specific error messages