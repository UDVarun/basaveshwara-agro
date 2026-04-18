import { cache } from "react";
import type {
  ShopifyGraphQLResponse,
  ShopifyProduct,
  ShopifyProductConnection,
  ShopifyCollection,
  ShopifyCart,
  ShopifyUserError,
} from "@/types/shopify";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  ALL_PRODUCT_HANDLES_QUERY,
} from "@/lib/queries/products";
import { COLLECTIONS_QUERY } from "@/lib/queries/collections";
import {
  CART_CREATE_MUTATION,
  CART_QUERY,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from "@/lib/queries/cart";
import { CUSTOMER_QUERY } from "@/lib/queries/customer";

// ─── Config ───────────────────────────────────────────────────────────────────

function getShopifyConfig() {
  const domain = process.env["SHOPIFY_STORE_DOMAIN"];
  const token = process.env["SHOPIFY_STOREFRONT_TOKEN"];

  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  return {
    endpoint: `https://${domain}/api/2025-01/graphql.json`,
    token,
  };
}

// ─── Core GraphQL fetcher ─────────────────────────────────────────────────────

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
    // Fail fast — abort if Shopify doesn't respond in 5s (e.g. wrong domain)
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    // Log server-side only — never forward to client
    console.error("[shopify] GraphQL errors:", json.errors);
    throw new Error("Shopify GraphQL error");
  }

  if (!json.data) {
    throw new Error("No data returned from Shopify");
  }

  return json.data;
}

export async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const shopId = process.env["SHOPIFY_SHOP_ID"];
  const endpoint = `https://shopify.com/${shopId}/account/customer/api/2025-01/graphql`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Shopify Customer API error: ${response.status}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    console.error("[shopify] Customer API errors:", json.errors);
    throw new Error("Shopify Customer API GraphQL error");
  }

  return json.data!;
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export async function getCustomer(accessToken: string) {
  const data = await customerAccountFetch<{ customer: any }>(
    accessToken,
    CUSTOMER_QUERY
  );
  return data.customer;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const getProducts = cache(async (params: {
  first?: number;
  after?: string;
  query?: string;
}): Promise<ShopifyProductConnection> => {
  const data = await shopifyFetch<{ products: ShopifyProductConnection }>(
    PRODUCTS_QUERY,
    {
      first: params.first ?? 20,
      after: params.after ?? null,
      ...(params.query !== undefined && { query: params.query }),
    }
  );
  return data.products;
});

export const getProductByHandle = cache(async (
  handle: string
): Promise<ShopifyProduct | null> => {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  return data.product;
});

// Named alias avoids TS7022 circular inference
type AllHandlesResponse = {
  products: {
    edges: Array<{ node: { handle: string }; cursor: string }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

export async function getAllProductHandles(): Promise<string[]> {
  const handles: string[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const data: AllHandlesResponse = await shopifyFetch<AllHandlesResponse>(
      ALL_PRODUCT_HANDLES_QUERY,
      { first: 250, after }
    );

    for (const edge of data.products.edges) {
      handles.push(edge.node.handle);
    }

    hasNextPage = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
  }

  return handles;
}

// ─── Collections ──────────────────────────────────────────────────────────────

export const getCollections = cache(async (first = 20): Promise<ShopifyCollection[]> => {
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(COLLECTIONS_QUERY, { first });
  return data.collections.edges.map((e) => e.node);
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_CREATE_MUTATION, { lines });
  return data.cartCreate;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(CART_QUERY, {
    cartId,
  });
  return data.cart;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });
  return data.cartLinesAdd;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  return data.cartLinesUpdate;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  return data.cartLinesRemove;
}
