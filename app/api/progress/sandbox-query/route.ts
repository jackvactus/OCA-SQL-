import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";

const MAX_QUERY_LENGTH = 500;

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const query = body?.query;
  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "query requis" }, { status: 400 });
  }

  const truncated = query.trim().slice(0, MAX_QUERY_LENGTH);
  await logActivity(user.id, "sandbox_query_executed", { query: truncated }, request);

  return NextResponse.json({ ok: true });
}
