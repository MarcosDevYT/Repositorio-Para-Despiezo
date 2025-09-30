import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

// Rutas privadas
export default middleware((req) => {
  const { nextUrl, auth } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!auth?.user;

  // Rutas públicas
  const publicRouter = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/api/auth/session",
    "/api/auth/providers",
    "/api/auth/csrf",
    "/api/auth/signin/google",
    "/api/auth/verify-email",
    "/api/auth/callback/google",
    "/tienda",
    "/tienda/[id]",
    "/productos",
    "/productos/[id]",
    "/api/uploadthing",
    "/api/sendcloud/webhook",
    "/api/stripe",
    "/api/stripe/connect",
  ];

  const isPublic =
    publicRouter.includes(pathname) || pathname.startsWith("/productos/"); // permite /productos/42, /productos/xxx

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (
    ["/login", "/register", "/forgot-password"].includes(pathname) &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
