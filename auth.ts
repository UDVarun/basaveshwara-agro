import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const providers: any[] = [
  Google({
    clientId: (process.env["GOOGLE_CLIENT_ID"] || "").trim(),
    clientSecret: (process.env["GOOGLE_CLIENT_SECRET"] || "").trim(),
  }),
];

if (process.env["EMAIL_SERVER"]) {
  providers.push(
    Email({
      server: process.env["EMAIL_SERVER"],
      from: process.env["EMAIL_FROM"] || "no-reply@basaveshwara-agro.com",
    })
  );
}

// Debug logs moved to a shared check below.
if (typeof window === "undefined") {
  console.log("🔍 [auth] Google Client ID:", process.env["GOOGLE_CLIENT_ID"] ? `${process.env["GOOGLE_CLIENT_ID"].slice(0, 15)}...` : "MISSING");
}

// Debug log for Shopify configuration (server-side only)
if (typeof window === "undefined") {
  const shopId = process.env["SHOPIFY_SHOP_ID"];
  const clientId = process.env["SHOPIFY_CLIENT_ID"];
  const hasSecret = !!process.env["SHOPIFY_CLIENT_SECRET"];
  
  console.log("🔍 [auth] Shopify Config Check:", {
    shopId: shopId || "MISSING",
    clientId: clientId ? `${clientId.slice(0, 8)}...` : "MISSING",
    hasSecret,
    nodeEnv: process.env["NODE_ENV"],
  });
}

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
      params: {
        scope: "openid email customer-account-api:full",
      },
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

import { authConfig } from "./auth.config";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] || "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] || "",
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: UpstashRedisAdapter(redis),
  providers,
} as any);
