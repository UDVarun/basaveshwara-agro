import { Redis } from "@upstash/redis";

/**
 * Global Redis client instance for server-side persistence.
 * Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env.
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn("[redis] Missing Upstash environment variables. Persistence will be disabled.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Key format for cart storage: `agro:cart:{userId}`
 */
export const getCartKey = (userId: string) => `agro:cart:${userId}`;
