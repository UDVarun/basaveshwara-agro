import { NextRequest, NextResponse } from "next/server";
import type { Ratelimit } from "@upstash/ratelimit";

// ─── Client-safe error message ────────────────────────────────────────────────
// Never expose internal errors or stack traces to the browser.

export const CLIENT_ERROR_MESSAGE =
  "Store is updating inventory. Please try again.";

// ─── Get real client IP (Vercel / CF compatible) ──────────────────────────────

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

// ─── Rate limit check ─────────────────────────────────────────────────────────

export async function checkRateLimit(
  limiter: Ratelimit,
  req: NextRequest
): Promise<NextResponse | null> {
  // Skip entirely when Upstash credentials are not configured (e.g. local dev)
  // Prevents ~5s DNS timeout on empty-string Redis URLs.
  if (!process.env["UPSTASH_REDIS_REST_URL"]) {
    return null;
  }

  const ip = getClientIp(req);

  try {
    const { success, reset } = await limiter.limit(ip);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: CLIENT_ERROR_MESSAGE },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  } catch {
    // Redis unavailable (DNS failure, wrong credentials, network error).
    // Log and allow the request through — store availability is preferred
    // over a complete lockout when the rate limiter is misconfigured.
    console.error("[checkRateLimit] Rate limiter error — request allowed through");
  }

  return null;
}

// ─── Standard error response ──────────────────────────────────────────────────

export function errorResponse(
  status: number,
  message = CLIENT_ERROR_MESSAGE
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// ─── Standard success response ────────────────────────────────────────────────

export function successResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse {
  const init: ResponseInit = { status };
  if (headers !== undefined) {
    init.headers = headers;
  }
  return NextResponse.json(data, init);
}
