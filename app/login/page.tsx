"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import Logo from "@/components/Logo";

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.requiresVerification) {
                    router.push(`/signup?email=${encodeURIComponent(email)}`);
                    return;
                }
                setError(data.error || "Invalid email or password.");
                return;
            }

            await refreshUser();
            router.push("/dashboard");
        } catch {
            setError("Connection failure. Please check your network.");
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
                        Sign In
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Access your short links and API keys
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
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
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="font-semibold text-gray-900 dark:text-white hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
