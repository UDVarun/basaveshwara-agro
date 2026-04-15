# REVIEW_GRAPH.md — Sri Basaveshwara Agro Kendra

> Tracks code-review-graph status, reviewed items, deferred items, and graph stats for every build step.
> Updated at the end of each step after running `code-review-graph update && code-review-graph status`.

---

## Step 1 — Project Foundation, Security & SEO Scaffolding

**Branch:** `step/01-project-setup`
**Date:** 2026-04-15

### Reviewed Items

| Item | Status | Notes |
|---|---|---|
| `tsconfig.json` | Done | strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes + noImplicitReturns + noFallthroughCasesInSwitch |
| `next.config.ts` | Done | 6 HTTP security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control, CSP |
| `app/layout.tsx` | Done | Nunito via next/font/google, --font-nunito variable, global metadata (title template, description, keywords, openGraph, locale en_IN), bg-agro-white on body |
| `app/globals.css` | Done | @theme with agro-green + agro-white tokens, box-sizing reset, font-smoothing, line-height 1.6. Zero gradients, zero dark mode. |
| `app/error.tsx` | Done | "We are updating our store." only — no Error object, no stack trace exposed |
| `.env.local.example` | Done | Documents all 5 env vars. Only NEXT_PUBLIC_BASE_URL is public. |
| `.gitignore` | Done | .env.local, .env*.local, .env*, .code-review-graph/ all listed |
| `SECURITY.md` | Done | pnpm audit failure documented (deprecated endpoint), manual dep review, security checklist |
| Folder structure | Done | /app/api/v1/, /components, /lib, /context, /types all created |
| `.prettierrc` | Done | semi, singleQuote false, trailingComma es5, tabWidth 2, printWidth 100 |
| `eslint.config.mjs` | Done | nextVitals + nextTs + eslint-config-prettier |

### Deferred Items

| Item | Reason |
|---|---|
| `pnpm audit` | npm audit endpoint retired (HTTP 410). Will revisit when pnpm fixes fallback. |
| Actual Shopify credentials | Not yet available — placeholder in .env.local.example |
| JSON-LD Local Business schema | Deferred to Step 2 (homepage build) |
| `code-review-graph` setup | Tool requires Python 3.10+ — run `pipx install code-review-graph` locally |

### Graph Stats

```
$ code-review-graph status
Nodes: 10
Edges: 14
Files: 6
Languages: tsx, javascript, typescript
Last updated: 2026-04-15T10:57:22
Built on branch: step/01-project-setup
Built at commit: 9eb0b5c27871
```

### Design Law Compliance

- [x] Background: flat #F8FAFC only
- [x] Accent: #166534 (Earthy Green) defined in @theme
- [x] Font: Nunito via next/font/google — one font only
- [x] Body line-height: 1.6
- [x] No gradients anywhere
- [x] No dark mode (zero `dark:` Tailwind variants)
- [x] No glassmorphism / backdrop-blur
- [x] No glowing borders / neon effects
- [x] No tech buzzwords in any copy

---

## Step 2 — Shopify Storefront API Proxy

**Branch:** `step/02-api-proxy`
**Date:** 2026-04-15

### Reviewed Items

| File | Status | Notes |
|---|---|---|
| `types/shopify.ts` | Done | Full Shopify types: Product, Variant, Image, Cart, CartLine, MoneyV2, GraphQL envelope, UserError |
| `lib/shopify.ts` | Done | Core GraphQL fetcher (server-side only). Queries: products list, product by handle, all handles (paginated, for sitemap), collections. Mutations: cart create/get/add lines/update lines/remove lines. `AllHandlesResponse` type alias fixes TS7022. |
| `lib/ratelimit.ts` | Done | Upstash sliding window: read 60/min, cart 10/min, checkout 5/min. Lazy Redis init — no build failure without credentials. |
| `lib/api-helpers.ts` | Done | `checkRateLimit` returns 429 + Retry-After. `errorResponse` / `successResponse`. CLIENT_ERROR_MESSAGE constant — no stack traces. |
| `app/api/v1/products/route.ts` | Done | GET — Zod validates first (1–50), after (max 500), q (max 200). Conditional spread for exactOptionalPropertyTypes. |
| `app/api/v1/products/[handle]/route.ts` | Done | GET — Zod regex `/^[a-z0-9-]+$/` validates handle. 404 on missing product. |
| `app/api/v1/collections/route.ts` | Done | GET — read rate limit, fetches 20 collections. |
| `app/api/v1/cart/route.ts` | Done | POST (create) — validates Shopify GID format for variant IDs. GET (fetch) — validates cart GID. |
| `app/api/v1/cart/[cartId]/lines/route.ts` | Done | POST (add) / PATCH (update) / DELETE (remove) — all cart limiter, all GID-validated. |

### TypeScript Errors Fixed

| Error | Fix |
|---|---|
| `TS2379` in `products/route.ts` — undefined not assignable with exactOptionalPropertyTypes | Conditional spread: `...(after !== undefined && { after })` |
| `TS2379` in `api-helpers.ts` — `headers: undefined` not assignable to `HeadersInit` | Build `ResponseInit` object conditionally: `if (headers !== undefined) init.headers = headers` |
| `TS7022` in `shopify.ts` — `data` implicit any in `getAllProductHandles` | Extracted `AllHandlesResponse` type alias, used explicit annotation `const data: AllHandlesResponse` |

### Security Checklist

- [x] All Shopify/Redis tokens are server-side only (`process.env["..."]` — no `NEXT_PUBLIC_`)
- [x] Zod validates every query param and request body before touching Shopify
- [x] Shopify GID format validated with regex on all IDs (variant, cart, line IDs)
- [x] Rate limiter: read 60/min, cart 10/min, checkout 5/min — 429 + Retry-After on breach
- [x] No stack traces to client — only `CLIENT_ERROR_MESSAGE` returned on errors
- [x] Shopify GraphQL errors logged server-side only (`console.error`) — never forwarded
- [x] CORS: same-origin (Next.js App Router default)
- [x] API versioning: all routes under `/api/v1/`

### Graph Stats

```
$ code-review-graph status
Nodes: 45
Edges: 169
Files: 15
Languages: typescript, tsx, javascript
Last updated: 2026-04-15T11:09:33
Built on branch: step/02-api-proxy
Built at commit: 5fe2236d5aa9
```

### Deferred Items

| Item | Reason |
|---|---|
| Search route `/api/v1/search` | Deferred to Step 6 (Search page) |
| Checkout session route | Deferred to Step 5 (Cart & Checkout) |
| Real Shopify credentials | Need store domain + Storefront API token |
| Real Upstash credentials | Need Redis REST URL + token |

---

## Step 3 — Product Listing Page

_Not started._

---

## Step 4 — Product Detail Page

_Not started._

---

## Step 5 — Cart & Checkout

_Not started._

---

## Step 6 — Search

_Not started._

---

## Step 7 — Collections / Category Pages

_Not started._

---

## Step 8 — Performance & Image Optimization

_Not started._

---

## Step 9 — Dynamic Sitemap & SEO Finalization

_Not started._

---

## Step 10 — Production Hardening & Deployment

_Not started._
