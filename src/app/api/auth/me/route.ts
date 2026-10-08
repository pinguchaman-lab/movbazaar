import { NextRequest, NextResponse } from "next/server";
import { VIP_COOKIE_NAME, VipUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(VIP_COOKIE_NAME)?.value;

  if (!cookie) {
    return NextResponse.json({ isVip: false, user: null });
  }

  try {
    const decoded = JSON.parse(Buffer.from(cookie, "base64").toString("utf-8"));
    if (decoded && decoded.email && decoded.isVip) {
      const user: VipUser = {
        email: decoded.email,
        isVip: true,
        plan: "VIP 100% Ad-Free Pass",
      };
      return NextResponse.json({ isVip: true, user });
    }
  } catch {
    // Cookie malformed
  }

  return NextResponse.json({ isVip: false, user: null });
}
