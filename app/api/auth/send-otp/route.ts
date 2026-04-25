import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { createHmac } from "crypto";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] || "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] || "",
});

/**
 * HMAC-SHA256 hash of OTP — the raw code is NEVER stored.
 * Even if the Redis DB were compromised, the attacker gets
 * hashes, not usable codes.
 */
function hashOtp(otp: string, email: string): string {
  return createHmac("sha256", process.env["AUTH_SECRET"] || "fallback-secret")
    .update(`${email.toLowerCase()}:${otp}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate limit: max 3 OTP sends per email per 10 minutes
    const rateLimitKey = `otp:ratelimit:${email}`;
    const sendCount = (await redis.get<number>(rateLimitKey)) ?? 0;
    if (sendCount >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store HMAC hash (never the plain OTP) with 10-minute expiry
    const hashedOtp = hashOtp(otp, email);
    await redis.setex(
      `otp:hash:${email}`,
      600,
      JSON.stringify({ hash: hashedOtp, attempts: 0 })
    );

    // Increment the rate limit counter
    const pipeline = redis.pipeline();
    pipeline.incr(rateLimitKey);
    pipeline.expire(rateLimitKey, 600);
    await pipeline.exec();

    // Send the plain OTP via email (only ever leaves the server here)
    const transport = createTransport(process.env["EMAIL_SERVER"] || "");
    await transport.sendMail({
      to: email,
      from: process.env["EMAIL_FROM"] || "no-reply@basaveshwara-agro.com",
      subject: `Your Login Code: ${otp}`,
      text: `Your Basaveshwara Agro security code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
      html: `
        <div style="background:#f7f7f5;padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
          <div style="background:white;max-width:480px;margin:0 auto;border-radius:14px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
            <div style="text-align:center;margin-bottom:24px">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:#f0fdf4;border-radius:12px;margin-bottom:12px">
                <span style="font-size:24px">🌾</span>
              </div>
              <h1 style="font-size:20px;color:#111;margin:0;font-weight:700">Basaveshwara Agro</h1>
            </div>

            <p style="color:#444;font-size:15px;text-align:center;margin-bottom:28px;line-height:1.5">
              Your secure sign-in code is below. This code is valid for <strong>10 minutes</strong>.
            </p>

            <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px">
              <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#166534;font-variant-numeric:tabular-nums">${otp}</span>
            </div>

            <p style="color:#888;font-size:13px;text-align:center;line-height:1.5">
              If you didn't request this code, please ignore this email.<br/>
              <strong>Never share this code with anyone.</strong>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json(
      { error: "Failed to send code. Please try again." },
      { status: 500 }
    );
  }
}
