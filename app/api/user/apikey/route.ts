import { NextRequest, NextResponse } from "next/server";
import { authenticateRequestUser } from "@/lib/session";
import { generateSecureApiKey } from "@/lib/security";

export async function POST(request: NextRequest) {
    try {
        const user = await authenticateRequestUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 }
            );
        }

        user.apiKey = generateSecureApiKey();
        await user.save();

        return NextResponse.json({
            success: true,
            apiKey: user.apiKey,
        });
    } catch (error) {
        console.error("API key regeneration error:", error);
        return NextResponse.json(
            { error: "Failed to rotate API key." },
            { status: 500 }
        );
    }
}
