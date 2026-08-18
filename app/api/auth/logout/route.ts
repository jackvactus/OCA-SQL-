import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getSessionUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (user) {
    await logActivity(user.id, "logout", {}, request);
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
