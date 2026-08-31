import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { submitExamSession } from "@/lib/exam-session";
import { applyRecordExam, updateProgress } from "@/lib/progress";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const MESSAGES: Record<string, { message: string; status: number }> = {
  introuvable: { message: "Session d'examen introuvable", status: 404 },
  deja_remise: { message: "Cette copie a déjà été remise", status: 409 },
  expiree: { message: "Le temps imparti est écoulé", status: 410 },
  reponses_invalides: { message: "Réponses invalides", status: 400 },
};

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const limite = rateLimit(`exam:submit:${user.id}:${clientIp(request)}`, {
    limit: 60,
    windowMs: 3_600_000,
  });
  if (!limite.ok) {
    return tooManyRequests(limite.retryAfterSeconds, "Trop de remises. Réessayez plus tard.");
  }

  const body = await request.json().catch(() => null);
  const sessionId = body?.sessionId;
  const answers = body?.answers;

  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return NextResponse.json({ error: "Session manquante" }, { status: 400 });
  }
  if (answers === null || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
  }

  // Normalisation : clés numériques, valeurs = tableaux d'entiers.
  const normalisees: Record<number, number[]> = {};
  for (const [cle, valeur] of Object.entries(answers as Record<string, unknown>)) {
    const position = Number(cle);
    if (!Number.isInteger(position) || position < 0 || position > 1000) continue;
    if (!Array.isArray(valeur)) continue;
    normalisees[position] = valeur.filter((v): v is number => Number.isInteger(v));
  }

  const resultat = await submitExamSession(user.id, sessionId, normalisees);
  if ("error" in resultat) {
    const { message, status } = MESSAGES[resultat.error] ?? {
      message: "Remise impossible",
      status: 400,
    };
    return NextResponse.json({ error: message }, { status });
  }

  const progression = await updateProgress(user.id, (prev) =>
    applyRecordExam(prev, resultat.score, resultat.total, resultat.timeSeconds),
  );
  await logActivity(
    user.id,
    "exam_completed",
    { score: resultat.score, total: resultat.total, time: resultat.timeSeconds },
    request,
  );

  return NextResponse.json({ ...resultat, progress: progression });
}
