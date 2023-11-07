import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        await connectDB();

        const urlDoc = await Url.findOneAndUpdate(
            { $or: [{ shortCode: code }, { alias: code }] },
            { $inc: { clicks: 1 } },
            { returnDocument: "after" }
        );

        if (!urlDoc) {
            return NextResponse.json({ error: "Short URL not found." }, { status: 404 });
        }

        return NextResponse.json({ originalUrl: urlDoc.originalUrl });
    } catch (error) {
        console.error("Redirect error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
