import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { applyToggleBookmark, updateProgress } from "@/lib/progress";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !id.trim() || id.length > 200) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  let added = false;
  const next = await updateProgress(user.id, (prev) => {
    const result = applyToggleBookmark(prev, id);
    added = result.added;
    return result.data;
  });
  await logActivity(user.id, added ? "bookmark_added" : "bookmark_removed", { id }, request);

  return NextResponse.json(next);
}
