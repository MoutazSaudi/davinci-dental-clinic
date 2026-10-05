/**
 * Password hashing helpers (no Next.js imports, so the seed script can use them).
 * Stored format: "<salt-hex>:<scrypt-hash-base64>"
 */
import crypto from "node:crypto";

export function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("base64");
}

export function createPasswordRecord(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${hashPassword(password, salt)}`;
}

export function verifyPasswordRecord(password: string, stored: string) {
  try {
    const idx = stored.indexOf(":");
    if (idx < 1) return false;

    const salt = stored.slice(0, idx);
    const expected = Buffer.from(stored.slice(idx + 1));
    const actual = Buffer.from(hashPassword(password, salt));

    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
