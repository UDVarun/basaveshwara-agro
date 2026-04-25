import { NextRequest } from "next/server";
import { z } from "zod";
import { createCart } from "@/lib/shopify";
import { checkoutLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schema ─────────────────────────────────────────────────────────────

const CheckoutLineItem = z.object({
  variantId: z.string().min(1).max(500),
  quantity: z.number().int().min(1).max(99),
});

const CheckoutSchema = z.object({
  lineItems: z.array(CheckoutLineItem).min(1).max(100),
});

// ─── POST /api/v1/checkout ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Rate limit — checkout: 5/min (most restrictive)
  const rateLimitResponse = await checkRateLimit(checkoutLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "Invalid checkout input.");
  }

  // 3. Create cart via modern Shopify Cart API — server-side only
  try {
    const lines = parsed.data.lineItems.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    console.log("[checkout] Creating Shopify cart, lines:", JSON.stringify(lines));

    const { cart, userErrors } = await createCart(lines);

    console.log("[checkout] Cart result:", JSON.stringify({
      cartId: cart?.id,
      checkoutUrl: cart?.checkoutUrl,
      userErrors,
    }));

    if (userErrors && userErrors.length > 0) {
      console.error("[checkout] Shopify userErrors:", userErrors);
      return errorResponse(422, "Checkout is temporarily unavailable. Please try again.");
    }

    if (!cart?.checkoutUrl) {
      console.error("[checkout] Shopify returned no checkoutUrl. Full cart:", JSON.stringify(cart));
      return errorResponse(500, "Checkout is temporarily unavailable. Please try again.");
    }

    // Return ONLY the checkout URL — never expose internal Shopify IDs
    return successResponse({ checkoutUrl: cart.checkoutUrl });
  } catch (err) {
    console.error("[checkout] Exception:", err);
    return errorResponse(500);
  }
}
