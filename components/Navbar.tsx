"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSun, FiMoon, FiPlus, FiGrid, FiLogIn } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import Logo from "./Logo";

export default function Navbar() {
    const { theme, toggle } = useTheme();
    const { user, loading } = useAuth();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <Link href="/" className="no-underline">
                    <Logo className="w-7 h-7" textClassName="text-lg font-bold tracking-tight" />
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/shorten"
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                            pathname === "/shorten"
                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <FiPlus className="w-3.5 h-3.5" />
                        <span>Shorten</span>
                    </Link>

                    {!loading && user ? (
                        <Link
                            href="/dashboard"
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                                pathname === "/dashboard"
                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            <FiGrid className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                    ) : !loading ? (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
                        >
                            <FiLogIn className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                        </Link>
                    ) : null}

                    <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition bg-transparent border-0 cursor-pointer"
                    >
                        {theme === "dark" ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
