import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── Redis client ─────────────────────────────────────────────────────────────
// Lazily created so it only errors at request time if env vars are missing,
// not at module parse time (which would break static builds).

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env["UPSTASH_REDIS_REST_URL"] ?? "",
      token: process.env["UPSTASH_REDIS_REST_TOKEN"] ?? "",
    });
  }
  return _redis;
}

// ─── Rate limiter factory ─────────────────────────────────────────────────────

function makeRateLimiter(requests: number, windowSeconds: number) {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
    prefix: "agro-ratelimit",
  });
}

// ─── Exported limiters (per spec) ────────────────────────────────────────────

/**
 * Read routes: 60 req / 60 s per IP
 */
export const readLimiter = makeRateLimiter(60, 60);

/**
 * Cart mutations: 10 req / 60 s per IP
 */
export const cartLimiter = makeRateLimiter(10, 60);

/**
 * Checkout: 5 req / 60 s per IP
 */
export const checkoutLimiter = makeRateLimiter(5, 60);
