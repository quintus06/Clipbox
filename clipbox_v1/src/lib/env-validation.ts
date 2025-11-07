/**
 * Environment Variable Validation for OAuth
 * 
 * This module validates required environment variables for OAuth providers
 * and provides clear error messages when variables are missing or invalid.
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that a URL is properly formatted
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates Google OAuth environment variables
 */
export function validateGoogleOAuthEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check NEXTAUTH_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (!nextAuthUrl) {
    errors.push(
      'NEXTAUTH_URL is not set. This is required for OAuth redirect URIs. ' +
      'Set it to your application URL (e.g., https://yourdomain.com or http://localhost:3000 for development)'
    );
  } else if (!isValidUrl(nextAuthUrl)) {
    errors.push(
      `NEXTAUTH_URL is not a valid URL: "${nextAuthUrl}". ` +
      'It must start with http:// or https:// and be a complete URL'
    );
  } else if (nextAuthUrl.endsWith('/')) {
    warnings.push(
      'NEXTAUTH_URL should not end with a trailing slash. ' +
      `Current value: "${nextAuthUrl}". Consider removing the trailing slash.`
    );
  }

  // Check GOOGLE_CLIENT_ID
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    errors.push(
      'GOOGLE_CLIENT_ID is not set. Get this from Google Cloud Console: ' +
      'https://console.cloud.google.com/apis/credentials'
    );
  } else if (googleClientId.trim() !== googleClientId) {
    warnings.push('GOOGLE_CLIENT_ID has leading or trailing whitespace');
  }

  // Check GOOGLE_CLIENT_SECRET
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!googleClientSecret) {
    errors.push(
      'GOOGLE_CLIENT_SECRET is not set. Get this from Google Cloud Console: ' +
      'https://console.cloud.google.com/apis/credentials'
    );
  } else if (googleClientSecret.trim() !== googleClientSecret) {
    warnings.push('GOOGLE_CLIENT_SECRET has leading or trailing whitespace');
  }

  // Check redirect URI configuration
  const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
  const googleRedirectUriProd = process.env.GOOGLE_REDIRECT_URI_PROD;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !googleRedirectUriProd && !nextAuthUrl) {
    errors.push(
      'In production, either GOOGLE_REDIRECT_URI_PROD or NEXTAUTH_URL must be set. ' +
      'GOOGLE_REDIRECT_URI_PROD takes precedence if both are set.'
    );
  }

  if (!isProduction && !googleRedirectUri && !nextAuthUrl) {
    errors.push(
      'In development, either GOOGLE_REDIRECT_URI or NEXTAUTH_URL must be set. ' +
      'GOOGLE_REDIRECT_URI takes precedence if both are set.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets the Google OAuth redirect URI based on environment
 * Returns null if environment variables are not properly configured
 */
export function getGoogleRedirectUri(): string | null {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const prodUri = process.env.GOOGLE_REDIRECT_URI_PROD;
    if (prodUri) return prodUri;
    if (nextAuthUrl) return `${nextAuthUrl}/api/auth/google/callback`;
    return null;
  } else {
    const devUri = process.env.GOOGLE_REDIRECT_URI;
    if (devUri) return devUri;
    if (nextAuthUrl) return `${nextAuthUrl}/api/auth/google/callback`;
    return null;
  }
}

/**
 * Logs validation results to console with appropriate formatting
 */
export function logValidationResults(
  provider: string,
  result: EnvValidationResult
): void {
  if (result.isValid) {
    console.log(`✓ ${provider} OAuth environment variables are valid`);
    if (result.warnings.length > 0) {
      console.warn(`⚠ ${provider} OAuth warnings:`);
      result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }
  } else {
    console.error(`✗ ${provider} OAuth environment validation failed:`);
    result.errors.forEach((error) => console.error(`  - ${error}`));
    if (result.warnings.length > 0) {
      console.warn(`⚠ ${provider} OAuth warnings:`);
      result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }
  }
}

/**
 * Creates a detailed error response for missing environment variables
 */
export function createEnvErrorResponse(result: EnvValidationResult): {
  error: string;
  details: string[];
  documentation: string;
} {
  return {
    error: 'OAuth configuration error',
    details: result.errors,
    documentation:
      'Please ensure all required environment variables are set. ' +
      'See VERCEL_ENV_VARIABLES.md for setup instructions.',
  };
}