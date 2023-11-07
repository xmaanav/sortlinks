"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UrlEntry {
    _id: string;
    originalUrl: string;
    shortCode: string;
    alias?: string;
    clicks: number;
    createdAt: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function truncate(str: string, max = 60) {
    return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function DashboardPage() {
    const router = useRouter();
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const fetchUrls = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/urls");
            if (res.status === 401) {
                router.push("/admin");
                return;
            }
            const data = await res.json();
            if (data.success) setUrls(data.urls);
            else setError("Failed to load links.");
        } catch {
            setError("Network error loading links.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchUrls(); }, [fetchUrls]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this link? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/urls/${id}`, { method: "DELETE" });
            if (res.ok) setUrls((prev) => prev.filter((u) => u._id !== id));
            else setError("Failed to delete link.");
        } catch {
            setError("Network error while deleting.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
    };

    const handleCopy = async (url: string, id: string) => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const el = document.createElement("textarea");
            el.value = url;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filtered = urls.filter(
        (u) =>
            u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
            u.shortCode.toLowerCase().includes(search.toLowerCase()) ||
            (u.alias && u.alias.toLowerCase().includes(search.toLowerCase()))
    );

    const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all your short links</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/shorten"
                            className="text-sm font-medium px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                        >
                            + New Link
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors bg-white dark:bg-gray-900 cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Links", value: urls.length },
                        { label: "Total Clicks", value: totalClicks },
                        { label: "Custom Aliases", value: urls.filter((u) => u.alias).length },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Error banner */}
                {error && (
                    <div className="flex items-center justify-between gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                        <span>⚠ {error}</span>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 cursor-pointer bg-transparent border-0 text-lg leading-none">×</button>
                    </div>
                )}

                {/* Table card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">

                    {/* Table toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Links</h2>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-52 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                {filtered.length}/{urls.length}
                            </span>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="py-16 text-center">
                            <svg className="w-8 h-8 spin text-violet-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading links...</p>
                        </div>

                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-gray-400 dark:text-gray-600 text-sm">
                                {search ? "No links match your search." : "No links yet. Create your first one!"}
                            </p>
                        </div>

                    ) : (
                        /* Responsive table wrapper */
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
                                        <th className="text-left px-5 py-3">Original URL</th>
                                        <th className="text-left px-5 py-3">Short Code</th>
                                        <th className="text-left px-5 py-3 hidden md:table-cell">Alias</th>
                                        <th className="text-left px-5 py-3 hidden sm:table-cell">Clicks</th>
                                        <th className="text-left px-5 py-3 hidden lg:table-cell">Created</th>
                                        <th className="text-right px-5 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filtered.map((url) => {
                                        const shortUrl = `${baseUrl}/${url.alias || url.shortCode}`;
                                        return (
                                            <tr key={url._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">

                                                {/* Original URL */}
                                                <td className="px-5 py-3 max-w-xs">
                                                    <a
                                                        href={url.originalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={url.originalUrl}
                                                        className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-mono text-xs truncate block max-w-[200px] transition-colors"
                                                    >
                                                        {truncate(url.originalUrl)}
                                                    </a>
                                                </td>

                                                {/* Short code */}
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={shortUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-violet-600 dark:text-violet-400 font-mono font-semibold hover:underline"
                                                        >
                                                            {url.alias || url.shortCode}
                                                        </a>
                                                        <button
                                                            onClick={() => handleCopy(shortUrl, url._id)}
                                                            className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${copiedId === url._id
                                                                    ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                                                                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                                                                }`}
                                                        >
                                                            {copiedId === url._id ? "✓" : "Copy"}
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Alias */}
                                                <td className="px-5 py-3 hidden md:table-cell">
                                                    {url.alias ? (
                                                        <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 rounded-full px-2 py-0.5">
                                                            {url.alias}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 dark:text-gray-700 text-xs">—</span>
                                                    )}
                                                </td>

                                                {/* Clicks */}
                                                <td className="px-5 py-3 hidden sm:table-cell">
                                                    <span className={`font-semibold ${url.clicks > 0 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}>
                                                        {url.clicks.toLocaleString()}
                                                    </span>
                                                </td>

                                                {/* Date */}
                                                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                                                    {formatDate(url.createdAt)}
                                                </td>

                                                {/* Delete */}
                                                <td className="px-5 py-3 text-right">
                                                    <button
                                                        onClick={() => handleDelete(url._id)}
                                                        disabled={deletingId === url._id}
                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50 cursor-pointer bg-transparent"
                                                    >
                                                        {deletingId === url._id ? (
                                                            <svg className="w-3.5 h-3.5 spin inline" viewBox="0 0 24 24" fill="none">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                            </svg>
                                                        ) : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
