import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { createTransport } from "nodemailer";

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
      generateVerificationToken() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      async sendVerificationRequest({ identifier, url, provider, token }) {
        const { server, from } = provider;
        // Strip out the password block explicitly if the connection string isn't standard formats
        const transport = createTransport(server);
        
        await transport.sendMail({
          to: identifier,
          from: from,
          subject: `Your Login Code: ${token}`,
          text: `Your security code is: ${token}\n\nType this securely on the login page.`,
          html: `
            <div style="background-color:#f9f9f9;padding:40px 0;font-family:sans-serif">
              <div style="background-color:white;max-width:500px;margin:0 auto;border-radius:12px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
                <h1 style="font-size:24px;color:#333;margin-bottom:10px;text-align:center">Basaveshwara Agro</h1>
                <p style="color:#555;font-size:16px;text-align:center">Use the following security code to securely sign in to your account.</p>
                <div style="background-color:#f0fdf4;padding:20px;border-radius:8px;text-align:center;margin:30px 0">
                  <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#166534">${token}</span>
                </div>
                <p style="color:#888;font-size:14px;text-align:center;margin-top:20px">If you didn't request this email, you can safely ignore it.</p>
              </div>
            </div>
          `,
        });
      },
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
