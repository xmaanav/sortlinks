"use client";

import { useState } from "react";

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
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            setResult(data);
        } catch {
            setError("Network error. Please check your connection.");
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

    const handleReset = () => {
        setResult(null);
        setOriginalUrl("");
        setAlias("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Shorten a URL
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Paste a long URL and get a short link instantly. Add a custom alias if you want.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8">

                    {!result ? (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* URL input */}
                            <div>
                                <label htmlFor="originalUrl" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                                    Long URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="originalUrl"
                                    type="url"
                                    required
                                    placeholder="https://example.com/very/long/link"
                                    value={originalUrl}
                                    onChange={(e) => setOriginalUrl(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Alias input */}
                            <div>
                                <label htmlFor="alias" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                                    Custom Alias <span className="text-gray-400 font-normal normal-case">(optional)</span>
                                </label>
                                <div className="flex">
                                    <span className="flex items-center px-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-lg whitespace-nowrap">
                                        shortx.io/
                                    </span>
                                    <input
                                        id="alias"
                                        type="text"
                                        placeholder="my-link"
                                        value={alias}
                                        onChange={(e) => setAlias(e.target.value)}
                                        pattern="[a-zA-Z0-9_-]+"
                                        minLength={2}
                                        maxLength={50}
                                        className="flex-1 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-r-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition min-w-0"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1.5">
                                    Letters, numbers, hyphens, underscores. 2–50 chars.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                                    <span className="mt-0.5">⚠</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Short Link"
                                )}
                            </button>
                        </form>

                    ) : (

                        /* Result */
                        <div className="space-y-5">
                            {/* Success header */}
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-gray-900 dark:text-white">Link created!</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Copy and share your short link below.</p>
                            </div>

                            {/* Short URL */}
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your short link</p>
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <a
                                        href={result.shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-violet-600 dark:text-violet-400 font-semibold font-mono text-sm break-all hover:underline"
                                    >
                                        {result.shortUrl}
                                    </a>
                                    <button
                                        onClick={handleCopy}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors flex-shrink-0 cursor-pointer ${copied
                                                ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                                                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        {copied ? "✓ Copied" : "Copy"}
                                    </button>
                                </div>
                            </div>

                            {/* Original URL */}
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original URL</p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-mono break-all">{result.originalUrl}</p>
                                {result.alias && (
                                    <span className="inline-block mt-2 text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 rounded-full px-2.5 py-0.5">
                                        alias: {result.alias}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer bg-white dark:bg-gray-900"
                                >
                                    Shorten Another
                                </button>
                                <a
                                    href={result.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-sm font-medium text-center px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                                >
                                    Visit Link
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tips */}
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {[
                        "Custom aliases are brand-friendly",
                        "Track clicks in the admin panel",
                        "Links never expire",
                    ].map((tip) => (
                        <span key={tip} className="text-xs text-gray-400 dark:text-gray-600">
                            · {tip}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
