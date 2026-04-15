import { NextRequest } from "next/server";
import { z } from "zod";
import { addCartLines, updateCartLines, removeCartLines } from "@/lib/shopify";
import { cartLimiter } from "@/lib/ratelimit";
import {
  checkRateLimit,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// ─── Input schemas ────────────────────────────────────────────────────────────

const CartIdSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^gid:\/\/shopify\/Cart\//, "Invalid cart ID");

const AddLinesSchema = z.object({
  lines: z
    .array(
      z.object({
        merchandiseId: z
          .string()
          .min(1)
          .max(500)
          .regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/, "Invalid variant ID"),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1)
    .max(100),
});

const UpdateLinesSchema = z.object({
  lines: z
    .array(
      z.object({
        id: z
          .string()
          .min(1)
          .max(500)
          .regex(/^gid:\/\/shopify\/CartLine\//, "Invalid line ID"),
        quantity: z.number().int().min(0).max(99),
      })
    )
    .min(1)
    .max(100),
});

const RemoveLinesSchema = z.object({
  lineIds: z
    .array(
      z
        .string()
        .min(1)
        .max(500)
        .regex(/^gid:\/\/shopify\/CartLine\//, "Invalid line ID")
    )
    .min(1)
    .max(100),
});

async function parseBody(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// ─── POST /api/v1/cart/[cartId]/lines — add lines ────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(cartLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  const { cartId } = await params;
  if (!CartIdSchema.safeParse(cartId).success) {
    return errorResponse(400, "Invalid cart ID.");
  }

  const body = await parseBody(req);
  if (!body) return errorResponse(400, "Invalid JSON body.");

  const parsed = AddLinesSchema.safeParse(body);
  if (!parsed.success) return errorResponse(400, "Invalid line input.");

  try {
    const result = await addCartLines(cartId, parsed.data.lines);
    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not update cart. Please try again.");
    }
    return successResponse(result.cart);
  } catch {
    return errorResponse(500);
  }
}

// ─── PATCH /api/v1/cart/[cartId]/lines — update quantities ───────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(cartLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  const { cartId } = await params;
  if (!CartIdSchema.safeParse(cartId).success) {
    return errorResponse(400, "Invalid cart ID.");
  }

  const body = await parseBody(req);
  if (!body) return errorResponse(400, "Invalid JSON body.");

  const parsed = UpdateLinesSchema.safeParse(body);
  if (!parsed.success) return errorResponse(400, "Invalid line input.");

  try {
    const result = await updateCartLines(cartId, parsed.data.lines);
    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not update cart. Please try again.");
    }
    return successResponse(result.cart);
  } catch {
    return errorResponse(500);
  }
}

// ─── DELETE /api/v1/cart/[cartId]/lines — remove lines ───────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(cartLimiter, req);
  if (rateLimitResponse) return rateLimitResponse;

  const { cartId } = await params;
  if (!CartIdSchema.safeParse(cartId).success) {
    return errorResponse(400, "Invalid cart ID.");
  }

  const body = await parseBody(req);
  if (!body) return errorResponse(400, "Invalid JSON body.");

  const parsed = RemoveLinesSchema.safeParse(body);
  if (!parsed.success) return errorResponse(400, "Invalid line IDs.");

  try {
    const result = await removeCartLines(cartId, parsed.data.lineIds);
    if (result.userErrors.length > 0) {
      return errorResponse(422, "Could not update cart. Please try again.");
    }
    return successResponse(result.cart);
  } catch {
    return errorResponse(500);
  }
}
