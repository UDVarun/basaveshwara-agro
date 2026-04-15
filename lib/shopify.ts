import type {
  ShopifyGraphQLResponse,
  ShopifyProduct,
  ShopifyProductConnection,
  ShopifyCollection,
  ShopifyCart,
  ShopifyUserError,
} from "@/types/shopify";

// ─── Config ──────────────────────────────────────────────────────────────────

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
    // Next.js cache: revalidate every 60 seconds
    next: { revalidate: 60 },
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

// ─── GraphQL fragments ────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    vendor
    productType
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    seo { title description }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              id
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

// ─── Query: product list ──────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node { ...ProductFields }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export async function getProducts(params: {
  first?: number;
  after?: string;
  query?: string;
}): Promise<ShopifyProductConnection> {
  const data = await shopifyFetch<{ products: ShopifyProductConnection }>(
    PRODUCTS_QUERY,
    {
      first: params.first ?? 20,
      after: params.after ?? null,
      query: params.query ?? null,
    }
  );
  return data.products;
}

// ─── Query: single product by handle ─────────────────────────────────────────

const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  return data.product;
}

// ─── Query: all product handles (for sitemap) ─────────────────────────────────

const ALL_PRODUCT_HANDLES_QUERY = `
  query AllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node { handle }
        cursor
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

// Named alias avoids TS7022 circular inference when inline generic is complex
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

// ─── Query: collections ───────────────────────────────────────────────────────

const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        cursor
        node {
          id
          handle
          title
          description
          image { url altText width height }
          products(first: 6) {
            edges {
              cursor
              node {
                id handle title availableForSale
                featuredImage { url altText width height }
                priceRange {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
              }
            }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(COLLECTIONS_QUERY, { first });
  return data.collections.edges.map((e) => e.node);
}

// ─── Mutation: create cart ────────────────────────────────────────────────────

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_CREATE_MUTATION, { lines });
  return data.cartCreate;
}

// ─── Query: get cart ──────────────────────────────────────────────────────────

const CART_QUERY = `
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(CART_QUERY, {
    cartId,
  });
  return data.cart;
}

// ─── Mutation: add lines to cart ─────────────────────────────────────────────

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });
  return data.cartLinesAdd;
}

// ─── Mutation: update cart lines ──────────────────────────────────────────────

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  return data.cartLinesUpdate;
}

// ─── Mutation: remove cart lines ──────────────────────────────────────────────

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<{ cart: ShopifyCart; userErrors: ShopifyUserError[] }> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: ShopifyUserError[] };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  return data.cartLinesRemove;
}
