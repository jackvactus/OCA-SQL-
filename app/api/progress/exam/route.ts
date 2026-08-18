import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyRecordExam, updateProgress } from "@/lib/progress";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { score, total, time } = body ?? {};
  if (typeof score !== "number" || typeof total !== "number" || typeof time !== "number") {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const next = await updateProgress(user.id, (prev) => applyRecordExam(prev, score, total, time));
  await logActivity(user.id, "exam_completed", { score, total, time }, request);

  return NextResponse.json(next);
}
