import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide" },
      { status: 400 },
    );
  }

  const { displayName, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hashPassword(password);

  // Rely on the DB's unique constraint rather than a separate existence
  // check beforehand — a pre-check-then-insert has a race window where two
  // concurrent registrations for the same email can both pass the check.
  let user: { id: string; email: string };
  try {
    const inserted = await query<{ id: string; email: string }>(
      `insert into users (email, password_hash, display_name)
       values ($1, $2, $3)
       returning id, email`,
      [normalizedEmail, passwordHash, displayName],
    );
    user = inserted.rows[0];
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return NextResponse.json({ error: "Un compte existe déjà avec cet e-mail" }, { status: 409 });
    }
    throw err;
  }

  await query("insert into user_progress (user_id) values ($1) on conflict do nothing", [user.id]);

  // New accounts are always plain users — the "role" column defaults to
  // 'user' in the DB; admins are only ever created via scripts/seed-admin.ts
  // or promoted by an existing admin.
  await setSessionCookie({ ...user, role: "user" });
  await logActivity(user.id, "register", { displayName }, request);
  await logActivity(user.id, "login", { method: "register" }, request);

  return NextResponse.json({ id: user.id, email: user.email });
}
