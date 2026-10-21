import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signSessionToken } from "@/lib/security";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and verification code are required." },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedOtp = String(otp).trim();

        await connectDB();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return NextResponse.json(
                { error: "Account not found." },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: "Account is already verified." },
                { status: 200 }
            );
        }

        if (
            !user.verificationOtp ||
            user.verificationOtp !== normalizedOtp ||
            !user.verificationOtpExpiry ||
            user.verificationOtpExpiry < new Date()
        ) {
            return NextResponse.json(
                { error: "Invalid or expired verification code." },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verificationOtp = undefined;
        user.verificationOtpExpiry = undefined;
        await user.save();

        const token = await signSessionToken({
            userId: user._id.toString(),
            email: user.email,
        });

        const response = NextResponse.json({
            success: true,
            message: "Account verified successfully.",
            user: {
                id: user._id,
                email: user.email,
                apiKey: user.apiKey,
            },
        });

        response.cookies.set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "Verification processing error." },
            { status: 500 }
        );
    }
}
