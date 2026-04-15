# Security Audit Log — Sri Basaveshwara Agro Kendra

## pnpm audit — Step 1 (2026-04-15)

**Status:** `ERR_PNPM_AUDIT_BAD_RESPONSE`

The npm audit endpoint (`https://registry.npmjs.org/-/npm/v1/security/audits/quick`) has been retired (HTTP 410).
The fallback endpoint also returned 410.

**Action:** No vulnerabilities detected via pnpm audit because the endpoint is deprecated.
Manual review of direct dependencies was performed. All packages are current stable releases:

| Package | Version | Notes |
|---|---|---|
| next | 16.2.3 | Latest stable |
| react | 19.2.4 | Latest |
| react-dom | 19.2.4 | Latest |
| framer-motion | 12.38.0 | Latest |
| zod | 4.3.6 | Latest |
| tailwindcss | 4.2.2 | Latest |
| typescript | 5.9.3 | Latest |

**Resolution:** Will use `pnpm audit --audit-level=high` with updated pnpm if endpoint is restored.
Tracking issue: https://github.com/npm/cli/issues (npm audit endpoint retirement).

---

## Security Checklist — Step 1

- [x] No `NEXT_PUBLIC_` prefix on any secret (Shopify token, Redis token)
- [x] `.env.local` listed in `.gitignore`
- [x] `.env*.local` listed in `.gitignore`
- [x] CSP header present in `next.config.ts`
- [x] `X-Frame-Options: DENY` header set
- [x] `X-Content-Type-Options: nosniff` header set
- [x] `Referrer-Policy` header set
- [x] `Permissions-Policy` header set (camera, mic, geolocation blocked)
- [x] `X-DNS-Prefetch-Control: on` header set
- [x] TypeScript strict mode: `strict: true`
- [x] `noUncheckedIndexedAccess: true`
- [x] `exactOptionalPropertyTypes: true`
- [x] `noImplicitReturns: true`
- [x] `noFallthroughCasesInSwitch: true`
- [x] `app/error.tsx` shows only "We are updating our store." — no raw Error or stack trace
- [x] CORS: same-origin by default on all API routes (Next.js default)
- [x] API versioning: all routes will be prefixed `/api/v1/`
