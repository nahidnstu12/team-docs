import { NextResponse } from "next/server";
import authConfig from "./lib/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const session = !!request.auth;
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Create new request headers with `x-pathname`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // ✅ Skip public files (static, images, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/) // static files like .png, .css, .js
  ) {
    return response;
  }

  // ✅ BLOCK logged-in users from accessing `/auth/*`
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ✅ PROTECT admin routes - require authentication (admin check to be implemented)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // TODO: Add admin privilege check here
    // Note: Cannot use Prisma in middleware (edge runtime limitation)
    // Consider using JWT claims or server-side protection in layout
    // For now, all authenticated users can access admin (temporary)
  }

  // ✅ Allow non-authenticated users to access landing page at root
  if (pathname === "/") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // ✅ Redirect not-logged-in users from protected pages (except / and /auth)
  if (!session && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // ✅ Optional: redirect / to /home if logged in
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ✅ Allow to continue
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/", // root
    "/home", // main page
    "/auth/:path*", // must explicitly include auth
    "/admin/:path*", // admin routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
