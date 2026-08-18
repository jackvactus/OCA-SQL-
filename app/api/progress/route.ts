import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getProgress } from "@/lib/progress";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const progress = await getProgress(user.id);
  return NextResponse.json(progress);
}
