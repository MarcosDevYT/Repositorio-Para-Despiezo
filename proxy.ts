import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: proxy } = NextAuth(authConfig);

// Rutas privadas
export default proxy((req) => {
  const { nextUrl, auth } = req;
  const pathname = nextUrl.pathname;

  // Fallback: check cookies if auth.user is missing (due to Edge runtime limitations with PrismaAdapter in auth.config)
  const isLoggedIn =
    !!auth?.user ||
    !!req.cookies.get("authjs.session-token") ||
    !!req.cookies.get("__Secure-authjs.session-token") ||
    !!req.cookies.get("next-auth.session-token") ||
    !!req.cookies.get("__Secure-next-auth.session-token");

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
    "/api/ocr",
    "/api/scrapper-oem",
    "/api/search",
    "/api/search/suggest",
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
    "/api/vehicles",
    "/api/marcas",
    "/api/compatibilidades-oem",
    "/tools/compatibilidad",
  ];

  const isPublic =
    publicRouter.includes(pathname) ||
    pathname.startsWith("/productos/") ||
    pathname.startsWith("/tienda/") ||
    pathname.startsWith("/api/vehicles") ||
    pathname.startsWith("/api/compatibilidades-oem") ||
    pathname.startsWith("/tools/"); // permite /productos/42, /productos/xxx, /tienda/, /api/vehicles/*, /tools/*

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
