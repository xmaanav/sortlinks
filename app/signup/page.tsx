"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import Logo from "@/components/Logo";

export default function SignupPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [step, setStep] = useState<"form" | "verify">("form");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setInfo("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed. Please try again.");
                return;
            }

            setInfo("Verification code sent to your email inbox. Please check your inbox or spam folder.");
            setStep("verify");
        } catch {
            setError("Network issue. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid verification code.");
                return;
            }

            await refreshUser();
            router.push("/dashboard");
        } catch {
            setError("Verification error. Please retry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center px-4 py-12 sm:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </Link>
                </div>

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <Logo className="w-8 h-8" textClassName="text-xl font-bold" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step === "form" ? "Create an account" : "Verify your email"}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {step === "form" ? "Enter your email and password" : `Code sent to ${email}`}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    {step === "form" ? (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition"
                                />
                            </div>

                            {error && (
                                <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition cursor-pointer"
                            >
                                {loading ? "Sending Code..." : "Continue"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            {info && (
                                <div className="text-xs p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {info}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    6-Digit Verification Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition"
                                />
                            </div>

                            {error && (
                                <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition cursor-pointer"
                            >
                                {loading ? "Verifying..." : "Verify & Sign In"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep("form")}
                                className="w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-transparent border-0 cursor-pointer text-center"
                            >
                                Change email
                            </button>
                        </form>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-gray-900 dark:text-white hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
