import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateSixDigitOtp } from "@/lib/security";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email address is required." },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        await connectDB();

        const user = await User.findOne({ email: normalizedEmail });

        if (user && user.isVerified) {
            const otp = generateSixDigitOtp();
            user.resetOtp = otp;
            user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await sendOtpEmail(user.email, otp, "reset");
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, an OTP has been sent to your inbox.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Unable to process request." },
            { status: 500 }
        );
    }
}
