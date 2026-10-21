import Link from "next/link";
import type { Metadata } from "next";
import { FiHome, FiPlus, FiAlertTriangle } from "react-icons/fi";

export const metadata: Metadata = {
    title: "404 — Link Not Found",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 py-16">
            <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center mx-auto mb-6 text-amber-500">
                    <FiAlertTriangle className="w-8 h-8" />
                </div>
                <p className="text-6xl sm:text-7xl font-black text-gray-200 dark:text-gray-800 tracking-tighter select-none mb-1">
                    404
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    Short Link Not Found
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    The requested short link does not exist, was removed by the administrator, or the custom slug was misspelled.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                    >
                        <FiHome className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    <Link
                        href="/shorten"
                        className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md shadow-violet-600/20 transition"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Create New Link</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
