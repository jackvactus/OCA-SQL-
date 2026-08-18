import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyAddStudyTime, updateProgress } from "@/lib/progress";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const minutes = body?.minutes;
  if (typeof minutes !== "number") {
    return NextResponse.json({ error: "minutes requis" }, { status: 400 });
  }

  const next = await updateProgress(user.id, (prev) => applyAddStudyTime(prev, minutes));

  return NextResponse.json(next);
}
