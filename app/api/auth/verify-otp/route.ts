import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] || "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] || "",
});

const MAX_ATTEMPTS = 5;

function hashOtp(otp: string, email: string): string {
  return createHmac("sha256", process.env["AUTH_SECRET"] || "fallback-secret")
    .update(`${email.toLowerCase()}:${otp}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const otp = (body.otp || "").trim();

    // Validate inputs
    if (!email || !otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Retrieve the stored hash entry from Redis
    const storedRaw = await redis.get<string>(`otp:hash:${email}`);
    if (!storedRaw) {
      return NextResponse.json(
        { error: "Code expired or not found. Please request a new code." },
        { status: 400 }
      );
    }

    const stored = typeof storedRaw === "string" ? JSON.parse(storedRaw) : storedRaw;
    const { hash, attempts } = stored as { hash: string; attempts: number };

    // Block after too many failed attempts (brute-force protection)
    if (attempts >= MAX_ATTEMPTS) {
      await redis.del(`otp:hash:${email}`);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    // Compute hash of the input OTP
    const inputHash = hashOtp(otp, email);

    // Timing-safe comparison to prevent timing attacks
    const storedBuf = Buffer.from(hash, "hex");
    const inputBuf = Buffer.from(inputHash, "hex");

    const isValid =
      storedBuf.length === inputBuf.length &&
      timingSafeEqual(storedBuf, inputBuf);

    if (!isValid) {
      // Increment failed attempts, keep the same TTL (do a fresh setex)
      const ttl = await redis.ttl(`otp:hash:${email}`);
      const remaining_ttl = ttl > 0 ? ttl : 600;
      await redis.setex(
        `otp:hash:${email}`,
        remaining_ttl,
        JSON.stringify({ hash, attempts: attempts + 1 })
      );

      const remaining = MAX_ATTEMPTS - attempts - 1;
      return NextResponse.json(
        {
          error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        },
        { status: 400 }
      );
    }

    // SUCCESS — delete the OTP hash (one-time use)
    await redis.del(`otp:hash:${email}`);

    // Store a short-lived verified flag (2 min) so the Credentials provider can confirm
    await redis.setex(`otp:verified:${email}`, 120, "1");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
