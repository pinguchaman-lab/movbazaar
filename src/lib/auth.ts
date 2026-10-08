/**
 * MovBazaar VIP Authentication System
 *
 * Provides independent VIP login verification without requiring an external database.
 * Credentials can be configured in VIP_USERS env variable or fall back to default passes.
 * Format: "user1@example.com:pass1,user2@example.com:pass2"
 */

export interface VipUser {
  email: string;
  isVip: boolean;
  plan: string;
}

// Built-in default VIP credentials if no environment variable is specified
const DEFAULT_VIP_ACCOUNTS: Record<string, string> = {
  "vip@movbazaar.com": "movbazaar2026",
  "admin@movbazaar.com": "admin2026",
  "premium@movbazaar.com": "adfree2026",
};

/**
 * Retrieve all authorized VIP accounts
 */
export function getAllowedVipAccounts(): Record<string, string> {
  const envVips = process.env.VIP_USERS;
  const accounts: Record<string, string> = { ...DEFAULT_VIP_ACCOUNTS };

  if (envVips) {
    const pairs = envVips.split(",");
    for (const pair of pairs) {
      const [email, password] = pair.split(":").map((s) => s.trim());
      if (email && password) {
        accounts[email.toLowerCase()] = password;
      }
    }
  }

  return accounts;
}

/**
 * Verify given email and password against authorized VIP accounts
 */
export function verifyVipCredentials(
  email?: string,
  password?: string
): { success: boolean; user?: VipUser; message?: string } {
  if (!email || !password) {
    return {
      success: false,
      message: "Please enter both email and password.",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getAllowedVipAccounts();

  if (accounts[normalizedEmail] && accounts[normalizedEmail] === password.trim()) {
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

export const VIP_COOKIE_NAME = "movbazaar_vip_token";

