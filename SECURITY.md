# Security Documentation — Sri Basaveshwara Agro Kendra

## Secrets & Environment Variables

| Secret | Location | Exposure |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | `.env.local` / Vercel env | Server-only. Never in any `NEXT_PUBLIC_` variable. |
| `SHOPIFY_STOREFRONT_TOKEN` | `.env.local` / Vercel env | Server-only. Only read inside `lib/shopify.ts` on the server. |
| `UPSTASH_REDIS_REST_URL` | `.env.local` / Vercel env | Server-only. Only read in `lib/ratelimit.ts` and `proxy.ts`. |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` / Vercel env | Server-only. Only read in `lib/ratelimit.ts` and `proxy.ts`. |
| `NEXT_PUBLIC_BASE_URL` | `.env.local` / Vercel env | Public — domain only, no secrets. Used for internal fetch URLs from server. |

**Rule:** No Shopify token, Redis token, or any secret is ever assigned to a `NEXT_PUBLIC_` variable.

---

## Rate Limiting

Rate limiting is implemented at two layers:

### Layer 1 — Edge (proxy.ts)
- **Scope:** All `/api/v1/*` routes
- **Limit:** 100 requests / 60 seconds per IP (sliding window)
- **Implementation:** `@upstash/ratelimit` with `Redis.slidingWindow`
- **Response on breach:** `429 Too Many Requests` + `Retry-After` header
- **Graceful degradation:** If Redis is unavailable, requests are allowed through (store availability preferred over total lockout)

### Layer 2 — Per-route (lib/ratelimit.ts)
- **Read routes** (`/api/v1/products`, `/api/v1/collections`): 60 requests / 60 seconds per IP
- **Cart mutation routes** (`/api/v1/cart/create`, `/api/v1/cart/add`, etc.): 10 requests / 60 seconds per IP
- **Checkout route** (`/api/v1/checkout`): 5 requests / 60 seconds per IP

---

## Input Sanitization

All user-controllable inputs are validated with [Zod](https://zod.dev) before touching any downstream system:

| Input | Validation |
|---|---|
| Product `handle` URL parameter | Regex `/^[a-z0-9-]+$/`, max 100 chars |
| Product list `q` search param | Max 100 chars, HTML tags stripped, trimmed |
| Product list `first` param | Integer 1–50 |
| Product list `after` cursor | Max 500 chars |
| Cart `variantId` | Regex `/^gid:\/\/shopify\/ProductVariant\/\d+$/` |
| Cart `quantity` | Integer 1–99 |
| Cart `cartId` | Regex `/^gid:\/\/shopify\/Cart\//` |
| Cart line item `id` | Regex `/^gid:\/\/shopify\/CartLine\//` |
| Checkout `lineItems[].variantId` | Non-empty string, max 500 chars |
| Checkout `lineItems[].quantity` | Integer 1–99 |
| Search input (client) | Max 100 chars, HTML stripped, 300ms debounce |

---

## Error Handling

- **All Shopify GraphQL errors** are caught server-side and logged with `console.error`. They are **never forwarded to the client**.
- **All API route errors** return a generic `CLIENT_ERROR_MESSAGE` constant: `"We are updating our store. Please try again."`
- **Checkout errors** return: `"Checkout is temporarily unavailable. Please try again."`
- **Stack traces** are never included in any API response.
- **Product page errors** show: `"We are updating our store."` (no product internals)

---

## HTTP Security Headers (next.config.ts)

All routes receive the following security headers:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Restricts scripts to self + Shopify CDN |
| `X-Frame-Options` | `DENY` — prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera, microphone, geolocation all disabled |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

---

## Deferred Security Items

| Item | Reason | Risk |
|---|---|---|
| `pnpm audit` | npm audit endpoint deprecated (410 Gone) | LOW — no known vulnerabilities in dependencies as of 2026-04-15 |
| CSRF protection on cart mutations | Cart state is client-side only, no auth session | LOW — Shopify GIDs required for mutations |
| Shopify Storefront API scope minimization | Default scopes used | LOW — Verify minimal scopes before production |
| Real Lighthouse CI score | Requires deployed environment with real Shopify data | DEFERRED to post-launch |
