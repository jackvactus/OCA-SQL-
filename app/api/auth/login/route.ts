import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const result = await query<{ id: string; email: string; password_hash: string }>(
    "select id, email, password_hash from users where email = $1",
    [normalizedEmail],
  );
  const user = result.rows[0];

  // Always run bcrypt.compare, even for an unknown email, so response
  // timing doesn't reveal whether the address is registered.
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_PASSWORD_HASH);
  if (!user || !valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  await setSessionCookie({ id: user.id, email: user.email });
  await logActivity(user.id, "login", { method: "password" }, request);

  return NextResponse.json({ id: user.id, email: user.email });
}
