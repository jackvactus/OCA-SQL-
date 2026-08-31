import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validation/auth";
import { logActivity } from "@/lib/activity";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Deux fenêtres complémentaires : l'une freine une adresse qui balaie
  // beaucoup de comptes, l'autre protège un compte visé depuis plusieurs
  // adresses. Le compteur est incrémenté avant tout appel à bcrypt, pour que
  // la limite tienne même si l'attaquant cherche à saturer le CPU.
  const ip = clientIp(request);
  const parIp = rateLimit(`login:ip:${ip}`, { limit: 20, windowMs: 600_000, blockMs: 900_000 });
  if (!parIp.ok) {
    return tooManyRequests(
      parIp.retryAfterSeconds,
      "Trop de tentatives de connexion. Réessayez plus tard.",
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide" },
      { status: 400 },
    );
  }

  const { email, password, remember } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const parCompte = rateLimit(`login:compte:${normalizedEmail}`, {
    limit: 8,
    windowMs: 600_000,
    blockMs: 900_000,
  });
  if (!parCompte.ok) {
    return tooManyRequests(
      parCompte.retryAfterSeconds,
      "Trop de tentatives sur ce compte. Réessayez plus tard.",
    );
  }

  const result = await query<{
    id: string;
    email: string;
    password_hash: string;
    role: UserRole;
    is_active: boolean;
  }>(
    "select id, email, password_hash, role, is_active from users where email = $1",
    [normalizedEmail],
  );
  const user = result.rows[0];

  // Always run bcrypt.compare, even for an unknown email, so response
  // timing doesn't reveal whether the address is registered.
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_PASSWORD_HASH);
  if (!user || !valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  if (!user.is_active) {
    return NextResponse.json({ error: "Ce compte a été désactivé." }, { status: 403 });
  }

  await setSessionCookie(
    { id: user.id, email: user.email, role: user.role },
    { remember },
  );
  await logActivity(user.id, "login", { method: "password" }, request);

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
