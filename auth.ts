import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const providers = [
  Google({
    clientId: process.env["GOOGLE_CLIENT_ID"] || "",
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
  }),
];

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

export const authConfig: any = {
  providers,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.provider = account.provider;
        if (typeof account.access_token === "string") token.accessToken = account.access_token;
        if (typeof account.refresh_token === "string") token.refreshToken = account.refresh_token;
        if (typeof account.expires_at === "number") token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session) {
        session.provider = token.provider;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env["AUTH_SECRET"] || "development_secret_only_for_types",
  basePath: "/api/auth",
  debug: true, // Temporarily enabled to debug Vercel configuration error
  trustHost: true,
  cookies: {
    pkceCodeVerifier: {
      name: "authjs.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env["NODE_ENV"] === "production",
      },
    },
    state: {
      name: "authjs.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env["NODE_ENV"] === "production",
      },
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig as any);
