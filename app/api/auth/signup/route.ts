import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isLegitimateEmail } from "@/lib/emailValidator";
import { generateSecureApiKey, generateSixDigitOtp } from "@/lib/security";
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

        if (!isLegitimateEmail(normalizedEmail)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long." },
                { status: 400 }
            );
        }

        await connectDB();

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            if (existing.isVerified) {
                return NextResponse.json(
                    { error: "An account with this email already exists." },
                    { status: 409 }
                );
            }

            const otp = generateSixDigitOtp();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            const passwordHash = await bcrypt.hash(password, 12);

            const mailResult = await sendOtpEmail(normalizedEmail, otp, "verification");
            if (!mailResult.success) {
                return NextResponse.json(
                    { error: mailResult.error || "Failed to send verification email." },
                    { status: 400 }
                );
            }

            existing.passwordHash = passwordHash;
            existing.verificationOtp = otp;
            existing.verificationOtpExpiry = otpExpiry;
            await existing.save();

            return NextResponse.json({
                success: true,
                message: "Verification code sent to your email inbox.",
                email: normalizedEmail,
                requiresVerification: true,
            });
        }

        const otp = generateSixDigitOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const passwordHash = await bcrypt.hash(password, 12);
        const apiKey = generateSecureApiKey();

        const mailResult = await sendOtpEmail(normalizedEmail, otp, "verification");
        if (!mailResult.success) {
            return NextResponse.json(
                { error: mailResult.error || "Failed to send verification email." },
                { status: 400 }
            );
        }

        await User.create({
            email: normalizedEmail,
            passwordHash,
            apiKey,
            isVerified: false,
            verificationOtp: otp,
            verificationOtpExpiry: otpExpiry,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Verification code sent to your email inbox.",
                email: normalizedEmail,
                requiresVerification: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Registration failed. Please check inputs and retry." },
            { status: 500 }
        );
    }
}
