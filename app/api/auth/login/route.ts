import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signSessionToken, generateSixDigitOtp } from "@/lib/security";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        await connectDB();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            const otp = generateSixDigitOtp();
            user.verificationOtp = otp;
            user.verificationOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await sendOtpEmail(user.email, otp, "verification");

            return NextResponse.json(
                {
                    error: "Email verification required. A new code has been sent to your email.",
                    requiresVerification: true,
                    email: user.email,
                },
                { status: 403 }
            );
        }

        const token = await signSessionToken({
            userId: user._id.toString(),
            email: user.email,
        });

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
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
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Login failed. Please retry." },
            { status: 500 }
        );
    }
}
