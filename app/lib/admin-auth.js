import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_USERNAME = "naila";
const ADMIN_PASSWORD = "naila0110";
const SESSION_COOKIE = "naila_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12;
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || `${ADMIN_USERNAME}:${ADMIN_PASSWORD}:portfolio-admin`;

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const signExpiry = (expiry) =>
  createHmac("sha256", SESSION_SECRET).update(String(expiry)).digest("base64url");

export const verifyAdminCredentials = (username, password) =>
  safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD);

export async function createAdminSession() {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const sessionValue = `${expiry}.${signExpiry(expiry)}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const [expiryValue, signature] = value.split(".");
  const expiry = Number(expiryValue);

  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000) || !signature) {
    return false;
  }

  return safeCompare(signature, signExpiry(expiry));
}
