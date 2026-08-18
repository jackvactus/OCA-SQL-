import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signSession, verifySession, type UserRole } from "./jwt";

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

export async function getSessionUser(): Promise<CurrentUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, role: payload.role };
}

export async function setSessionCookie(user: CurrentUser, options: { remember?: boolean } = {}) {
  const token = await signSession({ sub: user.id, email: user.email, role: user.role });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // "Se souvenir de moi" unchecked → a session cookie (no maxAge) that the
    // browser discards on close, instead of persisting for 7 days.
    ...(options.remember === false ? {} : { maxAge: SESSION_MAX_AGE_SECONDS }),
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * For admin-only pages/routes: re-checks role and active status straight
 * from the database rather than trusting the JWT claim, so a demoted or
 * deactivated admin's still-valid cookie can't be used to mutate data.
 */
export async function requireAdmin(): Promise<CurrentUser | null> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  const result = await query<{ role: UserRole; is_active: boolean }>(
    "select role, is_active from users where id = $1",
    [sessionUser.id],
  );
  const row = result.rows[0];
  if (!row || row.role !== "admin" || !row.is_active) return null;

  return sessionUser;
}
