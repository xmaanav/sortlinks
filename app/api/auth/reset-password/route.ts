import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp, newPassword } = body;

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required." },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters long." },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedOtp = String(otp).trim();

        await connectDB();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid request." },
                { status: 400 }
            );
        }

        if (
            !user.resetOtp ||
            user.resetOtp !== normalizedOtp ||
            !user.resetOtpExpiry ||
            user.resetOtpExpiry < new Date()
        ) {
            return NextResponse.json(
                { error: "Invalid or expired reset code." },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        user.passwordHash = passwordHash;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successful. You may now log in.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password." },
            { status: 500 }
        );
    }
}
