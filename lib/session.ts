import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { verifySessionToken } from "@/lib/security";

export async function authenticateRequestUser(request: NextRequest): Promise<IUser | null> {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const tokenOrKey = authHeader.substring(7).trim();
        if (tokenOrKey.startsWith("slk_")) {
            await connectDB();
            const user = await User.findOne({ apiKey: tokenOrKey });
            if (user && user.isVerified) return user;
        }
    }

    const cookieToken = request.cookies.get("session_token")?.value;
    if (cookieToken) {
        const payload = await verifySessionToken(cookieToken);
        if (payload && payload.userId) {
            await connectDB();
            const user = await User.findById(payload.userId);
            if (user && user.isVerified) return user;
        }
    }

    return null;
}
