import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        if (email !== adminEmail || password !== adminPassword) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const token = await signToken({ email, role: "admin" });

        const response = NextResponse.json({ success: true, message: "Login successful." });
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
