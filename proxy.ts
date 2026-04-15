import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const config = {
  matcher: "/api/v1/:path*",
};

// ─── Lazy rate limiter (gracefully skipped if Redis is not configured) ─────────

let _limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const url = process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];

  if (!url || !token) {
    return null; // Allow requests through when Redis is not configured
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

// ─── Middleware — rate limit every /api/v1/* route ────────────────────────────

export async function proxy(req: NextRequest) {
  const limiter = getLimiter();

  // Skip rate limiting if Redis credentials are not configured (e.g. local dev)
  if (!limiter) {
    return NextResponse.next();
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

  try {
    const { success, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Store is updating inventory. Please try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch {
    // If rate limiter throws (e.g. Redis timeout), allow the request through
    // rather than taking down the store. Logged server-side only.
    console.error("[middleware] Rate limiter error — request allowed through");
    return NextResponse.next();
  }
}
