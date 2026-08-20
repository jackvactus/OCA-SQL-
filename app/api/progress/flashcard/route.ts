import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyUpdateFlashcard, updateProgress } from "@/lib/progress";
import { logActivity } from "@/lib/activity";
import { modules } from "@/lib/modules-data";

const flashcardIds = new Set(
  modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.flashcards.map((card) => card.id))),
);

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { cardId, quality } = body ?? {};
  if (
    typeof cardId !== "string" ||
    !flashcardIds.has(cardId) ||
    !Number.isInteger(quality) ||
    quality < 0 ||
    quality > 5
  ) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const next = await updateProgress(user.id, (prev) => applyUpdateFlashcard(prev, cardId, quality));
  await logActivity(user.id, "flashcard_reviewed", { cardId, quality }, request);

  return NextResponse.json(next);
}
