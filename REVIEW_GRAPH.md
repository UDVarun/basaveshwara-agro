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
code-review-graph status output — paste here after running locally:
$ code-review-graph status
```
> Run `pipx install code-review-graph` then `code-review-graph build` in the project root.
> Paste the `code-review-graph status` output above.

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

## Step 2 — Shopify API Proxy

_Not started._

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
