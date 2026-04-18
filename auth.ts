import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env["GOOGLE_CLIENT_ID"] || "",
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
    }),
    {
      id: "shopify",
      name: "Shopify",
      type: "oidc",
      issuer: `https://shopify.com/${process.env["SHOPIFY_SHOP_ID"]}`,
      wellKnown: `https://shopify.com/${process.env["SHOPIFY_SHOP_ID"]}/.well-known/openid-configuration`,
      clientId: process.env["SHOPIFY_CLIENT_ID"] || "",
      clientSecret: process.env["SHOPIFY_CLIENT_SECRET"] || "",
      authorization: {
        params: {
          scope: "openid email customer_account:full",
        },
      },
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        if (account.access_token) token.accessToken = account.access_token;
        if (account.refresh_token) token.refreshToken = account.refresh_token;
        if (account.expires_at) token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env["AUTH_SECRET"] || "development-secret",
  basePath: "/api/auth",
  debug: true,
  trustHost: true,
};

// Log configuration status (server-side only)
if (typeof window === "undefined") {
  const shopId = process.env["SHOPIFY_SHOP_ID"];
  if (!shopId) console.warn("⚠️ [auth] SHOPIFY_SHOP_ID is missing");
  if (!process.env["AUTH_SECRET"]) console.warn("⚠️ [auth] AUTH_SECRET is missing");
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
