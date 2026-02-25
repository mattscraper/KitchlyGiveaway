import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const instagram =
      typeof body.instagram === "string" ? sanitize(body.instagram.trim()) : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not set in environment variables");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const emailTo = process.env.EMAIL_TO || "contact@risodevelopment.com";

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emailTo,
      subject: `Kitchly Giveaway Entry - ${email}`,
      text: [
        "New giveaway entry:",
        "",
        `Email: ${email}`,
        `Instagram: ${instagram || "Not provided"}`,
        `Time: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    console.log("Entry email sent for:", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit entry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit entry. Please try again." },
      { status: 500 }
    );
  }
}
