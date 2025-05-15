import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

export async function middleware(request) {
	const token = await getToken({ req: request, secret });
	console.log("middleware session", token);
	console.log("middleware secret", secret);
	const { pathname } = request.nextUrl;

	// Create new request headers with `x-pathname`
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-pathname", pathname);

	// ✅ Skip public files (static, images, etc.)
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.startsWith("/api") ||
		pathname.match(/\.(.*)$/) // static files like .png, .css, .js
	) {
		return NextResponse.next();
	}

	// ✅ BLOCK logged-in users from accessing `/auth/*`
	if (token && pathname.startsWith("/auth")) {
		return NextResponse.redirect(new URL("/home", request.url));
	}

	// ✅ Redirect not-logged-in users from protected pages (except /auth)
	if (!token && !pathname.startsWith("/auth")) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}

	// ✅ Optional: redirect / to /home if logged in
	if (token && pathname === "/") {
		return NextResponse.redirect(new URL("/home", request.url));
	}

	// ✅ Allow to continue
	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: [
		"/", // root
		"/home", // main page
		"/auth/:path*", // must explicitly include auth
		"/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
	],
};
