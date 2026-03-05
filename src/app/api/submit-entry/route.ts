import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const instagram =
      typeof body.instagram === "string"
        ? sanitize(body.instagram.trim().replace(/^@/, ""))
        : "";

    if (!instagram || !/^[a-zA-Z0-9._]{1,30}$/.test(instagram)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Instagram handle." },
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
      subject: `Kitchly Giveaway Entry - @${instagram}`,
      text: [
        "New giveaway entry:",
        "",
        `Instagram: @${instagram}`,
        `Time: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    console.log("Entry email sent for: @" + instagram);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit entry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit entry. Please try again." },
      { status: 500 }
    );
  }
}
