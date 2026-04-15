import { NextRequest } from "next/server";
import { getCollections } from "@/lib/shopify";
import { readLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── GET /api/v1/collections ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Rate limit
  const rateLimitResponse = await checkRateLimit(readLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Fetch from Shopify
  try {
    const collections = await getCollections(20);
    return successResponse(collections);
  } catch {
    return errorResponse(500);
  }
}
