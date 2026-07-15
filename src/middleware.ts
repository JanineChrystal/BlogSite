import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isLoggedIn = request.cookies.has(SESSION_COOKIE);
	const isLoginRoute = pathname === "/admin/log-in";
	const isAdminRoute = pathname.startsWith("/admin");

	if (isAdminRoute && !isLoginRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/admin/log-in", request.url));
	}

	if (isLoginRoute && isLoggedIn) {
		return NextResponse.redirect(new URL("/admin/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
