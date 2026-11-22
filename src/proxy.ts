import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Filtre rapide : sans cookie de session, /admin renvoie vers la connexion.
 * La vraie vérification se fait dans chaque page et action (requireAdmin).
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/connexion")) return NextResponse.next();
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
