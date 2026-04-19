import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const providers = [
  Google({
    clientId: process.env["GOOGLE_CLIENT_ID"] || "",
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
  }),
];

if (process.env["SHOPIFY_SHOP_ID"]) {
  providers.push({
    id: "shopify",
    name: "Shopify",
    type: "oidc" as any,
    issuer: `https://shopify.com/${process.env["SHOPIFY_SHOP_ID"]}`,
    wellKnown: `https://shopify.com/${process.env["SHOPIFY_SHOP_ID"]}/.well-known/openid-configuration`,
    clientId: process.env["SHOPIFY_CLIENT_ID"] || "",
    clientSecret: process.env["SHOPIFY_CLIENT_SECRET"] || "",
    authorization: {
      params: {
        scope: "openid email customer_account:full",
      },
    },
    checks: ["pkce" as any, "state" as any],
    profile(profile: any) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
      };
    },
  } as any);
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
  debug: process.env["NODE_ENV"] === "development",
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
