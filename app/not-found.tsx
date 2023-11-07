import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 — Link Not Found",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-8xl font-black text-gray-100 dark:text-gray-800 select-none mb-2">404</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Link Not Found</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                    The short link you followed doesn&apos;t exist or has been removed.
                    Double-check the URL or create a new one.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="text-sm font-medium px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors bg-white dark:bg-gray-900"
                    >
                        ← Back Home
                    </Link>
                    <Link
                        href="/shorten"
                        className="text-sm font-medium px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                    >
                        Create New Link
                    </Link>
                </div>
            </div>
        </div>
    );
}
