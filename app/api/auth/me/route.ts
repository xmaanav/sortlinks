import { NextRequest, NextResponse } from "next/server";
import { authenticateRequestUser } from "@/lib/session";

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateRequestUser(request);
        if (!user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user._id,
                email: user.email,
                apiKey: user.apiKey,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json(
            { error: "Internal session error." },
            { status: 500 }
        );
    }
}
