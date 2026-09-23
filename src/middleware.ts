import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Vercel/Netlify/Cloudflare headers
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country") ||
    "OTHER";

  // Set cookie (1 day, accessible client-side)
  response.cookies.set("user-country", country.toUpperCase(), {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Skip static assets, API routes, and admin
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\..*).*)"],
};