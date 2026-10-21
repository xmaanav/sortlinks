"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiMail,
    FiLock,
    FiKey,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowLeft,
} from "react-icons/fi";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<"request" | "reset">("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setInfo("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Unable to process request.");
                return;
            }

            setInfo("If an account exists, a 6-digit recovery code was dispatched to your email.");
            setStep("reset");
        } catch {
            setError("Connection issue. Please retry.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Password reset failed.");
                return;
            }

            router.push("/login?reset=success");
        } catch {
            setError("Failed to reset password. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center px-4 py-12 sm:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Login</span>
                    </Link>
                </div>

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <Logo className="w-9 h-9" textClassName="text-2xl font-bold tracking-tight" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {step === "request" ? "Recover Your Account" : "Set New Password"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {step === "request"
                            ? "Enter your verified email address to receive a 6-digit OTP"
                            : `Enter the code sent to ${email} and set your new password`}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                    {step === "request" ? (
                        <form onSubmit={handleRequestOtp} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                                >
                                    <FiMail className="w-3.5 h-3.5 text-violet-600" />
                                    <span>Account Email</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="yourname@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl px-3.5 py-3">
                                    <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                {loading ? "Sending Recovery Code..." : "Send Reset Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {info && (
                                <div className="flex items-start gap-2 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs rounded-xl px-3.5 py-3">
                                    <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-600" />
                                    <span>{info}</span>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="otp"
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                                >
                                    <FiKey className="w-3.5 h-3.5 text-violet-600" />
                                    <span>6-Digit Reset Code</span>
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                                >
                                    <FiLock className="w-3.5 h-3.5 text-violet-600" />
                                    <span>New Password</span>
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    required
                                    minLength={8}
                                    placeholder="Minimum 8 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl px-3.5 py-3">
                                    <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                {loading ? "Updating Password..." : "Set New Password & Return"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
