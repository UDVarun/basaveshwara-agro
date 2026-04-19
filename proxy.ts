import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from "@/auth";

export const config = {
  // Combine matchers: rate limit API, and handle auth for pages
  matcher: [
    "/api/v1/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// ─── Lazy rate limiter (gracefully skipped if Redis is not configured) ─────────

let _limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const url = process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];

  if (!url || !token) {
    return null; 
  }

  if (!_limiter) {
    _limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      analytics: false,
      prefix: "agro-mw",
    });
  }

  return _limiter;
}

// ─── Proxy (Next.js 16 replacement for middleware) ────────────────────────────

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Rate Limiting for API routes
  if (pathname.startsWith("/api/v1/")) {
    const limiter = getLimiter();
    if (limiter) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
      try {
        const { success, remaining, reset } = await limiter.limit(ip);
        if (!success) {
          const retryAfter = Math.ceil((reset - Date.now()) / 1000);
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { 
              status: 429, 
              headers: { "Retry-After": String(retryAfter) } 
            }
          );
        }
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Remaining", String(remaining));
        return response;
      } catch (err) {
        console.error("[proxy] Rate limiter error:", err);
      }
    }
  }

  // 2. Auth Protection for Pages
  const session = await auth();
  const protectedPaths = ["/profile", "/checkout"];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}
