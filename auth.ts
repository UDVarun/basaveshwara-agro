import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] || "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] || "",
});

const providers: any[] = [
  // ── Google OAuth ────────────────────────────────────────────────────────────
  Google({
    clientId: (process.env["GOOGLE_CLIENT_ID"] || "").trim(),
    clientSecret: (process.env["GOOGLE_CLIENT_SECRET"] || "").trim(),
  }),

  // ── Email OTP (custom server-side flow via /api/auth/send-otp + verify-otp)
  // The Credentials provider here is the LAST STEP: it trusts a server-side
  // verified flag stored in Redis by /api/auth/verify-otp. The OTP itself is
  // never sent through the client — the client only touches the verified flag.
  Credentials({
    id: "email-otp",
    name: "Email OTP",
    credentials: {
      email: { label: "Email", type: "email" },
    },
    async authorize(credentials) {
      const email = ((credentials?.email as string) || "").toLowerCase().trim();
      if (!email) return null;

      // Check for the server-set verified flag (set by /api/auth/verify-otp)
      const verified = await redis.get(`otp:verified:${email}`);
      if (!verified) return null;

      // One-time use — delete the flag immediately after consuming it
      await redis.del(`otp:verified:${email}`);

      // Return a minimal user object for the session
      return {
        id: email,
        email,
        name: email.split("@")[0],
        image: null,
      };
    },
  }),
];

// Debug logs (server-side only)
if (typeof window === "undefined") {
  console.log(
    "🔍 [auth] Google Client ID:",
    process.env["GOOGLE_CLIENT_ID"]
      ? `${process.env["GOOGLE_CLIENT_ID"].slice(0, 15)}...`
      : "MISSING"
  );
}

// ── Shopify OIDC ─────────────────────────────────────────────────────────────
if (process.env["SHOPIFY_SHOP_ID"]) {
  providers.push({
    id: "shopify",
    name: "Shopify",
    issuer: `https://shopify.com/authentication/${(process.env["SHOPIFY_SHOP_ID"] || "").trim()}`,
    clientId: (process.env["SHOPIFY_CLIENT_ID"] || "").trim(),
    clientSecret: (process.env["SHOPIFY_CLIENT_SECRET"] || "").trim(),
    type: "oidc" as any,
    authorization: {
      url: `https://shopify.com/authentication/${(process.env["SHOPIFY_SHOP_ID"] || "").trim()}/oauth/authorize`,
      params: { scope: "openid email customer-account-api:full" },
    },
    token: `https://shopify.com/authentication/${(process.env["SHOPIFY_SHOP_ID"] || "").trim()}/oauth/token`,
    jwks_endpoint: `https://shopify.com/authentication/${(process.env["SHOPIFY_SHOP_ID"] || "").trim()}/.well-known/jwks.json`,
    checks: ["pkce" as any, "state" as any],
    profile(profile: any) {
      return {
        id: profile.sub,
        name: profile.name || profile.email?.split("@")[0],
        email: profile.email,
        image: profile.picture,
      };
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: UpstashRedisAdapter(redis),
  providers,
  session: { strategy: "jwt" }, // Credentials provider requires JWT sessions
} as any);
