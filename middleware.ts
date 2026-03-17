import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("tx_token")?.value;
    const { pathname } = request.nextUrl;

    const protectedPageRoutes = ["/dashboard", "/profile", "/events/register"];
    const isProtectedPage = protectedPageRoutes.some((route) => pathname.startsWith(route));

    const isProtectedApiRoute =
        pathname.startsWith("/api/user/") ||
        pathname === "/api/events/register";

    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isProtectedApiRoute && !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
