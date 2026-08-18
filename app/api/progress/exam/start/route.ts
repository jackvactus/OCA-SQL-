import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const questionCount = typeof body?.questionCount === "number" ? body.questionCount : undefined;

  await logActivity(user.id, "exam_started", { questionCount }, request);

  return NextResponse.json({ ok: true });
}
