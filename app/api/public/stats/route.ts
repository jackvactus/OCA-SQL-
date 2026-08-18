import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/admin";

// Without this, Next statically optimizes this handler at build time (no
// cookies/headers/searchParams used) and would freeze the "live" stats at
// whatever they were during the build.
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getPublicStats();
  return NextResponse.json(stats);
}
