import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";
import { authenticateRequestUser } from "@/lib/session";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticateRequestUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 }
            );
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Link ID required." },
                { status: 400 }
            );
        }

        await connectDB();

        const deleted = await Url.findOneAndDelete({
            _id: id,
            userId: user._id,
        });

        if (!deleted) {
            return NextResponse.json(
                { error: "Link not found or access denied." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Link deleted successfully.",
        });
    } catch (error) {
        console.error("Delete user link error:", error);
        return NextResponse.json(
            { error: "Failed to delete link." },
            { status: 500 }
        );
    }
}
