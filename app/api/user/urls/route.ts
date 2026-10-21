import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";
import { authenticateRequestUser } from "@/lib/session";

export async function GET(request: NextRequest) {
    try {
        const user = await authenticateRequestUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required to view your personal links." },
                { status: 401 }
            );
        }

        await connectDB();

        const urls = await Url.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            urls,
        });
    } catch (error) {
        console.error("Fetch user links error:", error);
        return NextResponse.json(
            { error: "Unable to retrieve link records." },
            { status: 500 }
        );
    }
}
