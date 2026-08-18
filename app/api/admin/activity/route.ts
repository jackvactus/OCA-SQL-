import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { listAllActivity } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
  const action = searchParams.get("action") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  const result = await listAllActivity(limit, offset, { action, search });
  return NextResponse.json({ ...result, limit, offset });
}
