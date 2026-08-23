import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { allQuestions } from "@/lib/quiz-banks";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const questionCount = body?.questionCount;
  if (
    questionCount !== undefined &&
    (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > allQuestions.length)
  ) {
    return NextResponse.json({ error: "Nombre de questions invalide" }, { status: 400 });
  }

  await logActivity(user.id, "exam_started", { questionCount }, request);

  return NextResponse.json({ ok: true });
}
