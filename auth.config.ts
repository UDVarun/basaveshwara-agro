import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // we will add actual providers in auth.ts
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
  debug: true,
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
} satisfies NextAuthConfig;
