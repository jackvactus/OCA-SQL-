import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { certificationTracks, type TrackId } from "@/lib/certification-tracks";
import { answerQuestion } from "@/lib/assistant/answer";
import { recordExchange } from "@/lib/assistant/audit";
import type { AssistantContext } from "@/lib/assistant/types";

const TRACK_IDS = new Set(certificationTracks.map((t) => t.id as string));

/** Au-delà, la question n'est plus une question mais un collage de cours. */
const QUESTION_MAX = 2_000;

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Deux plafonds : par compte, parce que chaque question peut déclencher un
  // appel facturé chez le fournisseur qui sera branché ; par adresse, pour
  // qu'une série de comptes jetables ne contourne pas le premier.
  const parCompte = rateLimit(`assistant:${user.id}`, {
    limit: 40,
    windowMs: 3_600_000,
    blockMs: 600_000,
  });
  if (!parCompte.ok) {
    return tooManyRequests(parCompte.retryAfterSeconds, "Trop de questions. Patientez un instant.");
  }
  const parAdresse = rateLimit(`assistant:ip:${clientIp(request)}`, {
    limit: 120,
    windowMs: 3_600_000,
    blockMs: 600_000,
  });
  if (!parAdresse.ok) {
    return tooManyRequests(parAdresse.retryAfterSeconds, "Trop de questions. Patientez un instant.");
  }

  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Question vide" }, { status: 400 });
  }
  if (question.length > QUESTION_MAX) {
    return NextResponse.json({ error: "Question trop longue" }, { status: 400 });
  }

  const track = typeof body?.track === "string" && TRACK_IDS.has(body.track) ? body.track : certificationTracks[0].id;
  const context: AssistantContext = {
    path: typeof body?.path === "string" ? body.path.slice(0, 300) : "/",
    track: track as TrackId,
    locale: body?.locale === "en" ? "en" : "fr",
    subject: typeof body?.subject === "string" ? body.subject.slice(0, 200) : undefined,
  };

  let answer;
  try {
    answer = await answerQuestion(question, context);
  } catch {
    // Le point d'extension appartient à l'éditeur : sa défaillance ne doit ni
    // exposer sa trace au navigateur, ni faire tomber la page.
    return NextResponse.json({ error: "Réponse indisponible" }, { status: 502 });
  }

  try {
    const exchange = await recordExchange(user.id, question, answer, context);
    await logActivity(
      user.id,
      "assistant_question",
      { path: context.path, track: context.track, unavailable: answer.unavailable === true },
      request,
    );
    return NextResponse.json(exchange);
  } catch {
    // La transcription a échoué : la réponse reste due à l'apprenant, on la
    // rend sans identifiant persistant plutôt que de perdre les deux.
    return NextResponse.json({
      id: `local-${Date.now()}`,
      question,
      answer,
      createdAt: new Date().toISOString(),
      persisted: false,
    });
  }
}
