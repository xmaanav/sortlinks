"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiLink,
    FiBarChart2,
    FiKey,
    FiCopy,
    FiArrowRight,
    FiCheck,
} from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
    const { user } = useAuth();
    const [host, setHost] = useState("localhost:3000");

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.host) {
            setHost(window.location.host);
        }
    }, []);

    return (
        <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
            <section className="pt-20 pb-16 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                        Simple, fast URL shortening
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                        Create short links, track total visits, and manage links programmatically with developer API keys.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                        <Link
                            href="/shorten"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm transition"
                        >
                            <span>Shorten a URL</span>
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm transition"
                            >
                                <span>Go to Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href="/signup"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm transition"
                            >
                                <span>Create Account</span>
                            </Link>
                        )}
                    </div>

                    <div className="max-w-xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-left">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Example</div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                            <span className="font-mono text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                https://github.com/developer/portfolio
                            </span>
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                {host}/portfolio
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <FiLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Custom Aliases
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Pick memorable custom slugs for links or let the system generate short codes.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <FiBarChart2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Visit Analytics
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Inspect click statistics and visitor counts for each link you create.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <FiKey className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Developer API
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Authenticate requests using your personal API key via Bearer tokens.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                        Credit at footer: <strong className="font-semibold text-gray-800 dark:text-gray-200">MrAbhi2k3</strong>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/shorten" className="hover:text-gray-900 dark:hover:text-white transition">
                            Shorten
                        </Link>
                        {user ? (
                            <Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition">
                                    Login
                                </Link>
                                <Link href="/signup" className="hover:text-gray-900 dark:hover:text-white transition">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
