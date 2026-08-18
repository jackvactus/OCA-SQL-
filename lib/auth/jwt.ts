import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export type UserRole = "user" | "admin";

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export const SESSION_COOKIE = "session";
const SESSION_DURATION = "7d";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    // Cookies issued before the role claim existed won't have it — default
    // to "user" rather than rejecting the session.
    const role = payload.role === "admin" ? "admin" : "user";
    return { sub: payload.sub, email: payload.email, role };
  } catch {
    return null;
  }
}
