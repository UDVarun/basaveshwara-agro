import { NextRequest } from "next/server";
import { z } from "zod";
import { getProductByHandle } from "@/lib/shopify";
import { readLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schema ─────────────────────────────────────────────────────────────

// Shopify handles: lowercase letters, digits, hyphens only
const HandleSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9-]+$/, "Invalid product handle");

// ─── GET /api/v1/products/[handle] ───────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  // 1. Rate limit
  const rateLimitResponse = await checkRateLimit(readLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Validate & sanitize URL param
  const { handle } = await params;
  const parsed = HandleSchema.safeParse(handle);

  if (!parsed.success) {
    return errorResponse(400, "Invalid product handle.");
  }

  // 3. Fetch from Shopify
  try {
    const product = await getProductByHandle(parsed.data);

    if (!product) {
      return errorResponse(404, "Product not found.");
    }

    return successResponse(product);
  } catch {
    return errorResponse(500);
  }
}
