import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";
import { verifyToken } from "@/lib/auth";

async function isAdmin(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return !!(payload && payload.role === "admin");
}

export async function GET(request: NextRequest) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        await connectDB();
        const urls = await Url.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, urls });
    } catch (error) {
        console.error("Get URLs error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
