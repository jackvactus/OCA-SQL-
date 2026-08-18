import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { listUsers } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const users = await listUsers(searchParams.get("q") ?? undefined);
  return NextResponse.json({ users });
}
