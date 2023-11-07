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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { id } = await params;
        await connectDB();
        const deleted = await Url.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "URL not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "URL deleted successfully." });
    } catch (error) {
        console.error("Delete URL error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
