import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyRecordQuiz, updateProgress } from "@/lib/progress";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { quizId, correct, total } = body ?? {};
  if (typeof quizId !== "string" || typeof correct !== "number" || typeof total !== "number") {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const next = await updateProgress(user.id, (prev) => applyRecordQuiz(prev, quizId, correct, total));
  await logActivity(user.id, "quiz_completed", { quizId, correct, total }, request);

  return NextResponse.json(next);
}
