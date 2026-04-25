# Sri Basaveshwara Agro Kendra

Headless e-commerce storefront for a government-licensed agricultural dealer in Chikmagalur, Karnataka.
Built with Next.js 16 + Shopify Storefront API. Mobile-first, production-ready, security-hardened.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict + exactOptionalPropertyTypes) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Shopify | Storefront API 2025-01 (GraphQL) |
| Rate Limiting | Upstash Redis (sliding window) |
| Validation | Zod |
| Code Intelligence | code-review-graph |
| Linting | ESLint (Next.js + TypeScript + Prettier) |
| Formatting | Prettier |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- A Shopify store with Storefront API access
- Upstash Redis account (free tier sufficient)

---

## Local Setup

```bash
# 1. Clone and install
git clone https://github.com/your-org/basaveshwara-agro.git
cd basaveshwara-agro
pnpm install

# 2. Create .env.local from the template
copy .env.local.example .env.local
# Fill in your real values — see Environment Variables section below

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in real values.
**Never commit `.env.local` to version control.**

| Variable | Description |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | Your `*.myshopify.com` domain (no https://) |
| `SHOPIFY_STOREFRONT_TOKEN` | Storefront API public access token |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `NEXT_PUBLIC_BASE_URL` | Your production URL (e.g. `https://basaveshwaraagro.in`) |

### Getting your Shopify Storefront Token

1. Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**
2. Create a new app → **API credentials** → **Configure Storefront API scopes**
3. Enable: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`
4. Copy the **Storefront API access token** into `.env.local`

### Getting Upstash Redis credentials

1. Sign up at [console.upstash.com](https://console.upstash.com)
2. Create a Redis database → **REST API** tab
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

---

## code-review-graph Setup

code-review-graph is a local knowledge graph that gives AI tools structural context
with 6-8x fewer tokens than reading the full repo.

```bash
# 1. Install pipx (if not already installed)
pip install --user pipx
pipx ensurepath

# 2. Install code-review-graph
pipx install code-review-graph

# 3. Register with Claude Code
code-review-graph install --platform claude-code

# 4. Build the initial graph (run once after cloning)
code-review-graph build

# 5. Watch for incremental updates during development
code-review-graph watch

# 6. Check current graph stats
code-review-graph status
```

---

## Checkout Testing (Shopify Bogus Gateway)

To test checkout without real payments:

1. In Shopify Admin go to **Settings**, then **Payments**, then enable **Bogus Gateway**
2. Add a product to cart on your local or staging store
3. Click **Proceed to Checkout**
4. At the Shopify checkout, use these test card details:

| Field | Value |
|---|---|
| Card Number | `1` (success), `2` (failure), `3` (exception) |
| Expiry | Any future date (e.g. 12/26) |
| CVV | Any 3 digits (e.g. 123) |
| Name | Any name |

---

## Project Architecture

```
basaveshwara-agro/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar, Footer, ClientProviders)
│   ├── page.tsx                  # Homepage (JSON-LD, hero, bento grid)
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact page
│   ├── products/
│   │   ├── page.tsx              # Product listing (server, Suspense)
│   │   ├── loading.tsx           # Loading skeleton
│   │   ├── error.tsx             # Error boundary
│   │   └── [handle]/
│   │       ├── page.tsx          # Product detail (generateMetadata, JSON-LD)
│   │       ├── AddToCartButton.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── api/v1/                   # Secure Shopify proxy routes
│   │   ├── products/route.ts
│   │   ├── products/[handle]/
│   │   ├── collections/
│   │   ├── cart/route.ts
│   │   ├── cart/create/
│   │   ├── cart/add/
│   │   ├── cart/[cartId]/lines/
│   │   └── checkout/
│   ├── robots.ts                 # /robots.txt
│   └── sitemap.ts                # /sitemap.xml (dynamic)
│
├── components/
│   ├── Navbar.tsx                # Mobile-first sticky navbar with cart badge
│   ├── Footer.tsx                # Business info and trust signals
│   ├── ProductCard.tsx           # Anti-gravity hover card
│   ├── ProductCardSkeleton.tsx   # Loading skeleton
│   ├── SearchInput.tsx           # Zod-validated debounced search
│   ├── CartDrawer.tsx            # Slide-in cart drawer
│   ├── CheckoutButton.tsx        # Checkout with loading state
│   ├── ClientProviders.tsx       # CartProvider + CartDrawer wrapper
│   └── AnimatedSection.tsx       # Scroll-triggered whileInView wrapper
│
├── context/
│   └── CartContext.tsx           # useReducer cart (ADD/REMOVE/UPDATE/CLEAR)
│
├── lib/
│   ├── shopify.ts                # GraphQL fetcher + Shopify functions
│   ├── ratelimit.ts              # Upstash rate limiters
│   ├── api-helpers.ts            # Response helpers
│   └── queries/                  # Typed GraphQL query files
│       ├── fragments.ts
│       ├── products.ts
│       ├── collections.ts
│       └── cart.ts
│
├── types/
│   └── shopify.ts                # Shopify type system
│
├── proxy.ts                      # Edge rate limiting on /api/v1/*
└── next.config.ts                # Security headers (CSP, HSTS, etc.)
```

---

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## Deployment (Vercel)

```bash
vercel deploy --prod
```

Set all environment variables in **Vercel Dashboard → Settings → Environment Variables**.
See `vercel.json` for build configuration.


Emergency Bsckuop: git checkout v2.0.0
