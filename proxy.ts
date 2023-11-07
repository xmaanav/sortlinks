import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
