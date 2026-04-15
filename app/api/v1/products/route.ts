import { NextRequest } from "next/server";
import { z } from "zod";
import { getProducts } from "@/lib/shopify";
import { readLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schema ─────────────────────────────────────────────────────────────

const QuerySchema = z.object({
  first: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(20),
  after: z.string().max(500).optional(),
  q: z.string().max(200).optional(),
});

// ─── GET /api/v1/products ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Rate limit
  const rateLimitResponse = await checkRateLimit(readLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Validate & sanitize query params
  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(raw);

  if (!parsed.success) {
    return errorResponse(400, "Invalid query parameters.");
  }

  const { first, after, q } = parsed.data;

  // 3. Fetch from Shopify (omit optional keys when undefined — exactOptionalPropertyTypes)
  try {
    const products = await getProducts({
      first,
      ...(after !== undefined && { after }),
      ...(q !== undefined && { query: q }),
    });
    return successResponse(products);
  } catch {
    return errorResponse(500);
  }
}
