import { NextRequest, NextResponse } from "next/server";
import { verifyVipCredentials, VIP_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const verification = verifyVipCredentials(email, password);

    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 401 }
      );
    }

    // Create session token payload (base64 encoded JSON)
    const sessionPayload = Buffer.from(
      JSON.stringify({
        email: verification.user.email,
        isVip: true,
        issuedAt: Date.now(),
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: verification.user,
      message: "VIP login successful. Ads disabled across the entire site.",
    });

    // Set secure HTTP-only cookie valid for 30 days
    response.cookies.set({
      name: VIP_COOKIE_NAME,
      value: sessionPayload,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

