"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiLock,
    FiMail,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle,
    FiArrowLeft,
    FiShield,
} from "react-icons/fi";
import Logo from "@/components/Logo";

export default function AdminPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Authentication failed. Check credentials.");
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Network connection issue. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col justify-center px-4 py-12 sm:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-900/60 px-2 py-0.5 rounded-full">
                        <FiShield className="w-3 h-3" /> Secure Console
                    </span>
                </div>

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <Logo className="w-9 h-9" textClassName="text-2xl font-black tracking-tight" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Sign in to inspect link activity and manage redirects
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/40 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="admin-email"
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                            >
                                <FiMail className="w-3.5 h-3.5 text-violet-500" />
                                <span>Administrator Email</span>
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                required
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="admin-password"
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"
                            >
                                <FiLock className="w-3.5 h-3.5 text-violet-500" />
                                <span>Master Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer bg-transparent border-0 p-0"
                                    aria-label="Toggle password view"
                                >
                                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                </button>
                            </div>
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
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-violet-600/25 cursor-pointer active:scale-[0.99]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying Credentials...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <FiArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Default credentials set in your local environment variables.
                    </p>
                </div>
            </div>
        </div>
    );
}
