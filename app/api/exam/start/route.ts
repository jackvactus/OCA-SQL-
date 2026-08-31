import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { startExamSession } from "@/lib/exam-session";
import { certificationTracks, type TrackId } from "@/lib/certification-tracks";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const TRACK_IDS = new Set(certificationTracks.map((t) => t.id as string));

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Chaque session ouverte tire des questions et écrit une ligne : sans
  // plafond, une boucle pourrait remplir la table et sonder la banque.
  const limite = rateLimit(`exam:start:${user.id}`, {
    limit: 30,
    windowMs: 3_600_000,
    blockMs: 900_000,
  });
  if (!limite.ok) {
    return tooManyRequests(limite.retryAfterSeconds, "Trop d'examens démarrés. Réessayez plus tard.");
  }

  const body = await request.json().catch(() => null);
  const track = body?.track;
  const locale = body?.locale === "en" ? "en" : "fr";
  const questionCount = body?.questionCount;

  if (typeof track !== "string" || !TRACK_IDS.has(track)) {
    return NextResponse.json({ error: "Parcours inconnu" }, { status: 400 });
  }
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 500) {
    return NextResponse.json({ error: "Nombre de questions invalide" }, { status: 400 });
  }

  try {
    const session = await startExamSession(user.id, track as TrackId, locale, questionCount);
    await logActivity(
      user.id,
      "exam_started",
      { track, locale, questionCount: session.questions.length },
      request,
    );
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Impossible de démarrer l'examen" }, { status: 500 });
  }
}
