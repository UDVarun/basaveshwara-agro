import { NextRequest } from "next/server";
import { z } from "zod";
import { createCart } from "@/lib/shopify";
import { cartLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schema ─────────────────────────────────────────────────────────────

const CreateCartSchema = z.object({
  lines: z
    .array(
      z.object({
        merchandiseId: z
          .string()
          .min(1)
          .max(500)
          .regex(
            /^gid:\/\/shopify\/ProductVariant\/\d+$/,
            "Invalid variant ID"
          ),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1)
    .max(100)
    .optional(),
});

// ─── POST /api/v1/cart/create ─────────────────────────────────────────────────

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

  const parsed = CreateCartSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "Invalid cart input.");
  }

  // 3. Create cart via Shopify
  try {
    const result = await createCart(parsed.data.lines ?? []);

    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not create cart. Please try again.");
    }

    return successResponse(result.cart, 201);
  } catch {
    return errorResponse(500);
  }
}
