import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Routes that belong to signed-out users. A signed-in visitor is bounced off them.
 */
const AUTH_ROUTES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Optimistic check only — it reads the session cookie without touching the
    // database. Anything that actually depends on the user must re-check the
    // session server-side (see `auth.api.getSession`).
    const hasSession = getSessionCookie(request) !== null;
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isAuthRoute) {
        if (hasSession) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (!hasSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Everything except Next internals, the auth API itself and static assets.
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\.).*)"],
};
