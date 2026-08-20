import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { listAllActivity } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const parsedLimit = Number(searchParams.get("limit"));
  const parsedOffset = Number(searchParams.get("offset"));
  const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 20;
  const offset = Number.isInteger(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
  const action = searchParams.get("action") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  const result = await listAllActivity(limit, offset, { action, search });
  return NextResponse.json({ ...result, limit, offset });
}
