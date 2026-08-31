import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { clearExchanges, listExchanges } from "@/lib/assistant/audit";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

/** Transcription complète de l'apprenant connecté. */
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const url = new URL(request.url);
  const limitBrut = Number(url.searchParams.get("limit"));
  const offsetBrut = Number(url.searchParams.get("offset"));
  const limit = Number.isInteger(limitBrut) && limitBrut > 0 && limitBrut <= 200 ? limitBrut : 100;
  const offset = Number.isInteger(offsetBrut) && offsetBrut >= 0 ? offsetBrut : 0;

  try {
    return NextResponse.json({ exchanges: await listExchanges(user.id, limit, offset) });
  } catch {
    return NextResponse.json({ error: "Transcription indisponible" }, { status: 500 });
  }
}

/** Efface sa propre transcription. La trace appartient à l'apprenant. */
export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const limite = rateLimit(`assistant:clear:${user.id}`, { limit: 10, windowMs: 3_600_000 });
  if (!limite.ok) return tooManyRequests(limite.retryAfterSeconds, "Trop de suppressions. Réessayez plus tard.");

  try {
    return NextResponse.json({ deleted: await clearExchanges(user.id) });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
