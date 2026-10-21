"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiLink,
    FiCopy,
    FiCheck,
    FiExternalLink,
    FiAlertCircle,
    FiArrowLeft,
} from "react-icons/fi";

interface ShortenResult {
    shortUrl: string;
    shortCode: string;
    alias: string | null;
    originalUrl: string;
}

export default function ShortenPage() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ShortenResult | null>(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [hostPrefix, setHostPrefix] = useState("localhost:3000");

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.host) {
            setHostPrefix(window.location.host);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalUrl: originalUrl.trim(),
                    alias: alias.trim() || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Unable to shorten link.");
                return;
            }

            setResult(data);
        } catch {
            setError("Network issue. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.shortUrl);
        } catch {
            const el = document.createElement("textarea");
            el.value = result.shortUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="max-w-xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </Link>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Shorten a URL
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Paste your long URL and get a clean short link
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    {!result ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Destination URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://example.com/long-page-address"
                                    value={originalUrl}
                                    onChange={(e) => setOriginalUrl(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Custom Alias
                                    </label>
                                    <span className="text-[11px] text-gray-400">Optional</span>
                                </div>
                                <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-white">
                                    <span className="px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 border-r border-gray-300 dark:border-gray-700 select-none">
                                        {hostPrefix}/
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="custom-slug"
                                        value={alias}
                                        onChange={(e) => setAlias(e.target.value)}
                                        pattern="[a-zA-Z0-9_-]+"
                                        minLength={2}
                                        maxLength={50}
                                        className="flex-1 px-3 py-2 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                                    />
                                </div>
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
                                {loading ? "Generating..." : "Shorten URL"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                                <div className="text-xs text-gray-500 mb-1">Your Short Link</div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white break-all">
                                        {result.shortUrl}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                                    >
                                        {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setOriginalUrl("");
                                        setAlias("");
                                    }}
                                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer text-center"
                                >
                                    Shorten Another
                                </button>
                                <a
                                    href={result.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition text-center"
                                >
                                    <span>Test Link</span>
                                    <FiExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
