import { NextRequest } from "next/server";
import { z } from "zod";
import { shopifyFetch } from "@/lib/shopify";
import { CHECKOUT_CREATE_MUTATION } from "@/lib/queries/cart";
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutResponse {
  checkoutCreate: {
    checkout: { id: string; webUrl: string } | null;
    checkoutUserErrors: Array<{ field: string[] | null; message: string; code: string }>;
  };
}

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

  // 3. Create checkout via Shopify — server-side only
  try {
    const data = await shopifyFetch<CheckoutResponse>(
      CHECKOUT_CREATE_MUTATION,
      { lineItems: parsed.data.lineItems }
    );

    if (
      data.checkoutCreate.checkoutUserErrors.length > 0 ||
      !data.checkoutCreate.checkout
    ) {
      // Log errors server-side — never forward Shopify error messages to client
      console.error(
        "[checkout] Shopify user errors:",
        data.checkoutCreate.checkoutUserErrors
      );
      return errorResponse(
        422,
        "Checkout is temporarily unavailable. Please try again."
      );
    }

    // Return ONLY the checkout URL — never expose the Shopify checkout ID or internals
    return successResponse({
      checkoutUrl: data.checkoutCreate.checkout.webUrl,
    });
  } catch {
    return errorResponse(500);
  }
}
