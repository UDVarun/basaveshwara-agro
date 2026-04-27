import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { redis, getCartKey } from "@/lib/redis";
import { z } from "zod";

// Shared validation schema for cart items (sync with CartContext.tsx types)
const CartItemSchema = z.object({
  variantId: z.string(),
  title: z.string(),
  price: z.number().int(),
  currencyCode: z.string(),
  quantity: z.number().int().min(1).max(99),
  imageUrl: z.string().nullable(),
  imageAlt: z.string().nullable(),
  handle: z.string(),
});

const CartSyncSchema = z.object({
  items: z.array(CartItemSchema),
});

/**
 * GET: Fetch the user's persistent cart from Redis.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartKey = getCartKey(session.user.id);
    const cartData = await redis.get(cartKey);

    return NextResponse.json({ items: cartData || [] });
  } catch (error) {
    console.error("[api/cart] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Sync the client-side cart to Redis.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = CartSyncSchema.safeParse(body);

    if (!result.success) {
      console.error("[api/cart] Validation failed:", result.error);
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    const cartKey = getCartKey(session.user.id);
    
    // Core Isolation: We only ever write to the current session's key.
    await redis.set(cartKey, result.data.items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/cart] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
