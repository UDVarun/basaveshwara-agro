import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createShopifyDraftOrder, completeDraftOrder } from "@/lib/shopify";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] || "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] || "",
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    console.log(`[orders-api] Creating order for ${session.user.email} via ${paymentMethod}`);

    // 1. Create Draft Order in Shopify
    const draftResponse = await createShopifyDraftOrder({
      email: session.user.email,
      lines: items.map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity
      })),
      shippingAddress: shippingAddress
    });

    if (draftResponse.userErrors?.length > 0) {
      console.error("[orders-api] Draft order creation failed:", draftResponse.userErrors);
      return NextResponse.json({ 
        error: "Shopify sync failed", 
        details: draftResponse.userErrors 
      }, { status: 422 });
    }

    const draftId = draftResponse.draftOrder.id;

    // 2. Complete the Draft Order (convert to real Order)
    const completionResponse = await completeDraftOrder(draftId);

    if (completionResponse.userErrors?.length > 0) {
       console.error("[orders-api] Draft completion failed:", completionResponse.userErrors);
       return NextResponse.json({ 
         error: "Order completion failed", 
         details: completionResponse.userErrors 
       }, { status: 422 });
    }

    // 3. Clear the persistent Redis cart for this user
    await redis.del(`agro:cart:${session.user.email}`);

    console.log(`[orders-api] Order finalized successfully: ${completionResponse.draftOrder.order.name}`);

    return NextResponse.json({ 
      success: true, 
      orderId: completionResponse.draftOrder.order.id,
      orderName: completionResponse.draftOrder.order.name
    });

  } catch (error: any) {
    console.error("[orders-api] Fatal order error:", error);
    
    // If it's a "Missing Admin Token" error, we return a specific message
    if (error.message === "Missing Admin Token") {
       return NextResponse.json({ 
         error: "Shopify synchronization requires a SHOPIFY_ADMIN_ACCESS_TOKEN. Please contact administrator.",
         syncPending: true
       }, { status: 503 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
