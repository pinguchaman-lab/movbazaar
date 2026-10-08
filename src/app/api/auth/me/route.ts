import { NextRequest, NextResponse } from "next/server";
import { VIP_COOKIE_NAME, verifyVipToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(VIP_COOKIE_NAME)?.value;

  if (!cookie) {
    return NextResponse.json({ isVip: false, user: null });
  }

  // Cryptographically verifies signature using server HMAC secret
  const verifiedUser = verifyVipToken(cookie);

  if (verifiedUser) {
    return NextResponse.json({ isVip: true, user: verifiedUser });
  }

  // Token is expired, invalid, or forged
  return NextResponse.json({ isVip: false, user: null });
}
