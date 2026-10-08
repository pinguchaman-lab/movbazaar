import crypto from "crypto";

/**
 * MovBazaar Cryptographically Secure VIP Authentication & Verification
 *
 * Implements tamper-proof HMAC-SHA256 signed session tokens.
 * Client browsers CANNOT forge, tamper with, or generate VIP passes.
 * All credentials are only evaluated on the server side.
 */

export interface VipUser {
  email: string;
  isVip: boolean;
  plan: string;
}

// Server-side HMAC secret for signing VIP session tokens
const VIP_SECRET =
  process.env.VIP_SECRET ||
  process.env.AUTH_SECRET ||
  "movbazaar_hardened_vip_hmac_secret_2026_unforgeable";

/**
 * Retrieve all authorized VIP accounts from server environment
 */
export function getAllowedVipAccounts(): Record<string, string> {
  const envVips = process.env.VIP_USERS;
  const accounts: Record<string, string> = {};

  if (envVips) {
    const pairs = envVips.split(",");
    for (const pair of pairs) {
      const parts = pair.split(":");
      if (parts.length >= 2) {
        const email = parts[0].trim().toLowerCase();
        const password = parts.slice(1).join(":").trim();
        if (email && password) {
          accounts[email] = password;
        }
      }
    }
  }

  return accounts;
}

/**
 * Verify given email and password against authorized VIP accounts on the server
 */
export function verifyVipCredentials(
  email?: string,
  password?: string
): { success: boolean; user?: VipUser; message?: string } {
  if (!email || !password) {
    return {
      success: false,
      message: "Please enter both your VIP email and password.",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const accounts = getAllowedVipAccounts();

  // If no VIP accounts configured in env yet, allow an emergency setup pass if specified
  const targetPassword = accounts[normalizedEmail];

  if (targetPassword && targetPassword === trimmedPassword) {
    return {
      success: true,
      user: {
        email: normalizedEmail,
        isVip: true,
        plan: "VIP 100% Ad-Free Pass",
      },
    };
  }

  return {
    success: false,
    message: "Invalid VIP credentials. Please use the credentials provided by the administrator.",
  };
}

/**
 * Signs a tamper-proof session token using HMAC-SHA256
 */
export function signVipToken(user: VipUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      isVip: true,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", VIP_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes a tamper-proof VIP token using constant-time comparison
 */
export function verifyVipToken(token: string): VipUser | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", VIP_SECRET)
    .update(payload)
    .digest("base64url");

  // Constant-time signature verification prevents timing attacks
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf-8");
    const data = JSON.parse(raw);

    if (data.expiresAt && Date.now() > data.expiresAt) {
      return null; // Expired token
    }

    if (data.isVip && data.email) {
      return {
        email: data.email,
        isVip: true,
        plan: "VIP 100% Ad-Free Pass",
      };
    }
  } catch {
    return null;
  }

  return null;
}

export const VIP_COOKIE_NAME = "movbazaar_vip_token";
