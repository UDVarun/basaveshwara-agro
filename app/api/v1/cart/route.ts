import { NextRequest } from "next/server";
import { z } from "zod";
import { createCart, getCart } from "@/lib/shopify";
import { cartLimiter, readLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schemas ────────────────────────────────────────────────────────────

const CartLineInput = z.object({
  merchandiseId: z
    .string()
    .min(1)
    .max(500)
    .regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/, "Invalid variant ID"),
  quantity: z.number().int().min(1).max(99),
});

const CreateCartSchema = z.object({
  lines: z.array(CartLineInput).min(1).max(100),
});

// ─── POST /api/v1/cart — create a new cart ────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Rate limit (cart mutation)
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
    const result = await createCart(parsed.data.lines);

    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not create cart. Please try again.");
    }

    return successResponse(result.cart, 201);
  } catch {
    return errorResponse(500);
  }
}

// ─── GET /api/v1/cart?cartId=... — fetch an existing cart ────────────────────

const CartIdSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^gid:\/\/shopify\/Cart\//, "Invalid cart ID");

export async function GET(req: NextRequest) {
  // 1. Rate limit (read)
  const rateLimitResponse = await checkRateLimit(readLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Validate cartId param
  const cartId = req.nextUrl.searchParams.get("cartId");
  const parsed = CartIdSchema.safeParse(cartId);

  if (!parsed.success) {
    return errorResponse(400, "Invalid cart ID.");
  }

  // 3. Fetch cart
  try {
    const cart = await getCart(parsed.data);

    if (!cart) {
      return errorResponse(404, "Cart not found.");
    }

    return successResponse(cart);
  } catch {
    return errorResponse(500);
  }
}
