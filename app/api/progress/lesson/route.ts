import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyCompleteLesson, updateProgress } from "@/lib/progress";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const lessonId = body?.lessonId;
  if (typeof lessonId !== "string" || !lessonId) {
    return NextResponse.json({ error: "lessonId requis" }, { status: 400 });
  }

  let alreadyDone = false;
  const next = await updateProgress(user.id, (prev) => {
    alreadyDone = prev.completedLessons.includes(lessonId);
    return applyCompleteLesson(prev, lessonId);
  });

  if (!alreadyDone) {
    await logActivity(user.id, "lesson_completed", { lessonId }, request);
  }

  return NextResponse.json(next);
}
