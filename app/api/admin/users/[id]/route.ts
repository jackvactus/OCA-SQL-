import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { updateUser } from "@/lib/admin";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  if (params.id === admin.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas modifier votre propre rôle ou statut." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const role = body?.role;
  const isActive = body?.isActive;

  if (role !== undefined && role !== "user" && role !== "admin") {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }
  if (role === undefined && isActive === undefined) {
    return NextResponse.json({ error: "Aucune modification fournie" }, { status: 400 });
  }

  const updated = await updateUser(
    params.id,
    { role, isActive },
    { id: admin.id, email: admin.email },
    request,
  );
  if (!updated) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
