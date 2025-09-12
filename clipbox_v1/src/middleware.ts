// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-wrapper";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/verify-request",
  "/pricing",
  "/explorer",
  "/terms",
  "/privacy",
  "/cookies",
  "/support",
  "/help",
  "/faq",
  "/contact",
  "/about",
  "/how-it-works",
];

// Define role-based route access
const roleBasedRoutes = {
  "/dashboard/clipper": ["CLIPPER", "SUPER_ADMIN"],
  "/dashboard/advertiser": ["ADVERTISER", "SUPER_ADMIN"],
  "/dashboard/admin": ["SUPER_ADMIN"],
  "/campaigns/create": ["ADVERTISER", "SUPER_ADMIN"],
  "/submissions": ["CLIPPER", "SUPER_ADMIN"],
  "/balance": ["CLIPPER", "SUPER_ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // Redirect to signin if not authenticated
  if (!token) {
    console.log("[Middleware] No token found for path:", pathname);
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verify the token (using Edge-compatible version)
  const user = await verifyTokenEdge(token);
  
  if (!user) {
    // Invalid token, redirect to signin
    console.log("[Middleware] Invalid token for path:", pathname);
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(signInUrl);
    // Clear invalid token
    response.cookies.set("auth-token", "", {
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  console.log("[Middleware] User authenticated:", user.email, "Role:", user.role, "Path:", pathname);

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      const userRole = user.role;
      
      if (!allowedRoles.includes(userRole)) {
        console.log("[Middleware] Access denied for role", userRole, "to path:", pathname);
        // Redirect to appropriate dashboard based on role
        let redirectPath = "/dashboard";
        
        switch (userRole) {
          case "CLIPPER":
            redirectPath = "/dashboard/clipper";
            break;
          case "ADVERTISER":
            redirectPath = "/dashboard/advertiser";
            break;
          case "SUPER_ADMIN":
            redirectPath = "/dashboard/admin";
            break;
        }
        
        console.log("[Middleware] Redirecting to:", redirectPath);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      
      // User has access
      console.log("[Middleware] Access granted for role", userRole, "to path:", pathname);
    }
  }

  // Handle generic dashboard route - redirect to role-specific dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    const userRole = user.role;
    let redirectPath = "/dashboard";
    
    switch (userRole) {
      case "CLIPPER":
        redirectPath = "/dashboard/clipper";
        break;
      case "ADVERTISER":
        redirectPath = "/dashboard/advertiser";
        break;
      case "SUPER_ADMIN":
        redirectPath = "/dashboard/admin";
        break;
    }
    
    if (redirectPath !== "/dashboard") {
      console.log("[Middleware] Redirecting from generic dashboard to:", redirectPath);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  console.log("[Middleware] Allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};