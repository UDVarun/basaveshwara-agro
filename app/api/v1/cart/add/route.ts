import { NextRequest } from "next/server";
import { z } from "zod";
import { addCartLines } from "@/lib/shopify";
import { cartLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schema ─────────────────────────────────────────────────────────────
// Per spec: variantId (string), quantity (positive integer 1–99), plus cartId

const AddItemSchema = z.object({
  cartId: z
    .string()
    .min(1)
    .max(500)
    .regex(/^gid:\/\/shopify\/Cart\//, "Invalid cart ID"),
  variantId: z
    .string()
    .min(1)
    .max(500)
    .regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/, "Invalid variant ID"),
  quantity: z.number().int().min(1).max(99),
});

// ─── POST /api/v1/cart/add ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Rate limit — cart mutations: 10/min
  const rateLimitResponse = await checkRateLimit(cartLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  const parsed = AddItemSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "Invalid input.");
  }

  const { cartId, variantId, quantity } = parsed.data;

  // 3. Add line to cart via Shopify
  try {
    const result = await addCartLines(cartId, [
      { merchandiseId: variantId, quantity },
    ]);

    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not add item to cart. Please try again.");
    }

    return successResponse(result.cart);
  } catch {
    return errorResponse(500);
  }
}
