import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === "/login" ||
    pathname === "/register";

  const isRootPath = pathname === "/";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (token && (isPublicPath || isRootPath)) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};