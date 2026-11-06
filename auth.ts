import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mythia_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.TEAM_USERNAME || "admin";
  const expectedPass = process.env.TEAM_PASSWORD || "changeme";
  const userOk =
    username.length === expectedUser.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(expectedUser));
  const passOk =
    password.length === expectedPass.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(expectedPass));
  return userOk && passOk;
}

export function createSessionToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;
  const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }
  const [, issuedAt] = payload.split(":");
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < MAX_AGE * 1000;
}

export function getSessionUsername(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) return null;
  const [payloadB64] = (token as string).split(".");
  const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
  return payload.split(":")[0];
}

export function isAuthenticated(): boolean {
  return getSessionUsername() !== null;
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE;
