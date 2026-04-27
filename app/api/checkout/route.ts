import { NextRequest, NextResponse } from "next/server";
import { createCart } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn("[checkout-api] Received empty or invalid items array");
      return NextResponse.json(
        { message: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    const lines = items.map((item: any) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity || 1,
    }));

    console.log("[checkout-api] Initializing checkout for lines:", JSON.stringify(lines, null, 2));

    // Create checkout via Shopify Cart API
    const response = await createCart(lines);
    const { cart, userErrors } = response;

    if (userErrors && userErrors.length > 0) {
      console.error("[checkout-api] Shopify user errors:", JSON.stringify(userErrors, null, 2));
      return NextResponse.json(
        { 
          message: userErrors[0]?.message || "Checkout is temporarily unavailable.",
          details: userErrors 
        },
        { status: 422 }
      );
    }

    if (!cart || !cart.checkoutUrl) {
      console.error("[checkout-api] No cart or checkoutUrl returned from Shopify. Full response:", JSON.stringify(response, null, 2));
      return NextResponse.json(
        { message: "Could not generate checkout link. Please try again." },
        { status: 500 }
      );
    }

    console.log("[checkout-api] Checkout successfully created:", cart.checkoutUrl);
    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (error) {
    console.error("[checkout-api] Fatal exception during checkout initialization:", error);
    return NextResponse.json(
      { message: "Internal server error during checkout. Check server logs." },
      { status: 500 }
    );
  }
}
