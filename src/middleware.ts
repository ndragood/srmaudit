import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const secret = process.env.NEXTAUTH_SECRET || "srm_audit_secret_2026";

  // Ambil token secara eksplisit dengan dukungan secureCookie untuk HTTPS di Vercel
  const token = await getToken({
    req,
    secret,
    secureCookie: req.nextUrl.protocol === "https:",
  });

  // 1. Proteksi rute /assets dan /admin (harus login)
  if ((pathname.startsWith("/assets") || pathname.startsWith("/admin")) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Proteksi rute /admin (khusus ADMIN)
  if (pathname.startsWith("/admin") && (token as any)?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/assets", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/assets/:path*", "/admin/:path*"],
};