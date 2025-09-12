// This file is deprecated - NextAuth has been replaced with a custom JWT authentication system
// 
// The authentication endpoints are now:
// - POST /api/auth/login - Login with email/password
// - POST /api/auth/register - Register new user
// - POST /api/auth/logout - Logout user
// - GET /api/auth/me - Get current user
// - POST /api/auth/refresh - Refresh JWT token
//
// See src/contexts/auth-context.tsx for the client-side authentication logic
// See src/hooks/use-auth.ts for the authentication hook

export async function GET() {
  return new Response(
    JSON.stringify({ 
      error: "NextAuth has been replaced with a custom JWT authentication system. Please use /api/auth/login instead." 
    }),
    { 
      status: 410, // Gone
      headers: { "Content-Type": "application/json" }
    }
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({ 
      error: "NextAuth has been replaced with a custom JWT authentication system. Please use /api/auth/login instead." 
    }),
    { 
      status: 410, // Gone
      headers: { "Content-Type": "application/json" }
    }
  );
}