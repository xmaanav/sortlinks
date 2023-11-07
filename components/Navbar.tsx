"use client";

import Link from "next/link";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
    const { theme, toggle } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white no-underline"
                >
                    <span className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center text-white text-sm font-black">S</span>
                    ShortX
                </Link>

                {/* Right */}
                <div className="flex items-center gap-1">
                    <Link
                        href="/shorten"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Shorten URL
                    </Link>

                    <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1 cursor-pointer border-0 bg-transparent"
                    >
                        {theme === "dark" ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}

