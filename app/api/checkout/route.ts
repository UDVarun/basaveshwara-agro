import { NextRequest, NextResponse } from "next/server";
import { createCart } from "@/lib/shopify";

export interface CheckoutRequestItem {
  variantId: string; // Shopify Global ID  e.g. "gid://shopify/ProductVariant/12345"
  quantity: number;
}

/**
 * POST /api/checkout
 *
 * Accepts the client-side cart, creates a real Shopify Cart via the
 * Storefront API (server-side — token never exposed to browser), and
 * returns the secure Shopify `checkoutUrl` for the redirect.
 *
 * Request body: { items: CheckoutRequestItem[] }
 * Response:     { checkoutUrl: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CheckoutRequestItem[] = body.items ?? [];

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        typeof item.variantId !== "string" ||
        !item.variantId.startsWith("gid://") ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { error: "Invalid cart item data." },
          { status: 400 }
        );
      }
    }

    // Build Shopify cart server-side (Storefront token stays on server)
    const lines = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    const { cart, userErrors } = await createCart(lines);

    if (userErrors && userErrors.length > 0) {
      console.error("[checkout] Shopify userErrors:", userErrors);
      return NextResponse.json(
        { error: userErrors[0]?.message || "Failed to create cart." },
        { status: 422 }
      );
    }

    if (!cart?.checkoutUrl) {
      return NextResponse.json(
        { error: "Could not obtain checkout URL from Shopify." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
