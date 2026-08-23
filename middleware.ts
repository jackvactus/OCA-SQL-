import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt";

const PUBLIC_ONLY_PATHS = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isPublicOnlyPath = PUBLIC_ONLY_PATHS.includes(pathname);

  // Après connexion, le point d'entrée est le choix du parcours de
  // certification (OCA SQL / OCP I / OCP II), pas directement le tableau de bord.
  if (session && isPublicOnlyPath) {
    return NextResponse.redirect(new URL("/tracks", request.url));
  }

  if (!session && !isPublicOnlyPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fast, edge-only redirect for non-admins. The actual admin pages and
  // /api/admin/* routes re-verify role (and active status) against the
  // database via requireAdmin() before doing anything — this check is just
  // UX, not the security boundary.
  if (session && pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
