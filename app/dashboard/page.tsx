"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiLink,
    FiBarChart2,
    FiTag,
    FiTrash2,
    FiCopy,
    FiCheck,
    FiExternalLink,
    FiSearch,
    FiLogOut,
    FiPlus,
    FiRefreshCw,
    FiAlertCircle,
    FiKey,
    FiCalendar,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";

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

function truncate(str: string, max = 50) {
    return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout, refreshUser } = useAuth();
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [rotatingKey, setRotatingKey] = useState(false);
    const [hostPrefix, setHostPrefix] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHostPrefix(window.location.origin);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    const fetchUrls = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/urls");
            if (res.status === 401) {
                router.push("/login");
                return;
            }
            const data = await res.json();
            if (data.success) {
                setUrls(data.urls);
            } else {
                setError("Unable to load links.");
            }
        } catch {
            setError("Network connection issue while retrieving records.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        if (user) {
            fetchUrls();
        }
    }, [user, fetchUrls]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this link permanently?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/user/urls/${id}`, { method: "DELETE" });
            if (res.ok) {
                setUrls((prev) => prev.filter((u) => u._id !== id));
            } else {
                setError("Unable to delete link.");
            }
        } catch {
            setError("Network error deleting the record.");
        } finally {
            setDeletingId(null);
        }
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

    const handleCopyKey = async () => {
        if (!user?.apiKey) return;
        try {
            await navigator.clipboard.writeText(user.apiKey);
        } catch {
            const el = document.createElement("textarea");
            el.value = user.apiKey;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const handleRotateKey = async () => {
        if (!confirm("Regenerate your API key? Old key will immediately stop working.")) return;
        setRotatingKey(true);
        try {
            const res = await fetch("/api/user/apikey", { method: "POST" });
            if (res.ok) {
                await refreshUser();
            } else {
                setError("Failed to rotate API key.");
            }
        } catch {
            setError("Error requesting new key.");
        } finally {
            setRotatingKey(false);
        }
    };

    const handleSignOut = async () => {
        await logout();
        router.push("/login");
    };

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return urls;
        return urls.filter(
            (u) =>
                u.originalUrl.toLowerCase().includes(query) ||
                u.shortCode.toLowerCase().includes(query) ||
                (u.alias && u.alias.toLowerCase().includes(query))
        );
    }, [urls, search]);

    const totalClicks = useMemo(() => urls.reduce((sum, u) => sum + u.clicks, 0), [urls]);
    const totalCustomAliases = useMemo(() => urls.filter((u) => u.alias).length, [urls]);

    if (authLoading || (!user && !error)) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Personal Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Signed in as <strong className="text-gray-900 dark:text-white">{user?.email}</strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => fetchUrls(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                        >
                            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-violet-600" : ""}`} />
                            <span>Refresh</span>
                        </button>
                        <Link
                            href="/shorten"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Shorten Link</span>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:border-red-900/60 transition cursor-pointer"
                        >
                            <FiLogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                <FiKey className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Developer API Key</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Use in header: <code className="font-mono text-violet-600 dark:text-violet-400">Authorization: Bearer YOUR_KEY</code></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRotateKey}
                                disabled={rotatingKey}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                            >
                                {rotatingKey ? "Rotating..." : "Rotate Key"}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5">
                        <span className="font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex-1 truncate">
                            {showKey ? user?.apiKey : (user?.apiKey ? user.apiKey.slice(0, 8) + "••••••••••••••••••••••••••••••••" : "")}
                        </span>
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent border-0 cursor-pointer"
                            aria-label="Toggle key visibility"
                        >
                            {showKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleCopyKey}
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                                copiedKey
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {copiedKey ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                            <span>{copiedKey ? "Copied" : "Copy"}</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Your Short Links
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <FiLink className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {urls.length.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            Links created in your account
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Click Count
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FiBarChart2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {totalClicks.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            Total visitor interactions
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Custom Slugs
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <FiTag className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {totalCustomAliases.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            Personalized link aliases
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4 text-red-500" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => setError("")}
                            className="text-red-400 hover:text-red-600 font-bold text-lg bg-transparent border-0 cursor-pointer p-0 leading-none"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by link, slug or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right sm:text-left">
                            Displaying {filtered.length} of {urls.length} record{urls.length === 1 ? "" : "s"}
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Loading link analytics...
                            </p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <FiLink className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {search ? "No matching links found" : "No links in your account"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto">
                                {search
                                    ? "Try modifying your search criteria."
                                    : "Create your first shortened link to view performance metrics."}
                            </p>
                            {!search && (
                                <Link
                                    href="/shorten"
                                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    <span>Create First Link</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <th className="py-3 px-4 sm:px-6">Short Link</th>
                                        <th className="py-3 px-4 sm:px-6">Destination</th>
                                        <th className="py-3 px-4 sm:px-6 hidden md:table-cell">Alias</th>
                                        <th className="py-3 px-4 sm:px-6 text-center">Clicks</th>
                                        <th className="py-3 px-4 sm:px-6 hidden lg:table-cell">Created</th>
                                        <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filtered.map((url) => {
                                        const shortUrl = `${hostPrefix}/${url.alias || url.shortCode}`;
                                        return (
                                            <tr
                                                key={url._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                                            >
                                                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={shortUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-mono font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                                                        >
                                                            <span>/{url.alias || url.shortCode}</span>
                                                            <FiExternalLink className="w-3 h-3 opacity-60" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleCopy(shortUrl, url._id)}
                                                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                                copiedId === url._id
                                                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                                                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                            }`}
                                                            title="Copy to clipboard"
                                                        >
                                                            {copiedId === url._id ? (
                                                                <FiCheck className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <FiCopy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 sm:px-6 max-w-[200px] sm:max-w-xs truncate">
                                                    <a
                                                        href={url.originalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={url.originalUrl}
                                                        className="font-mono text-xs text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                                                    >
                                                        {truncate(url.originalUrl, 45)}
                                                    </a>
                                                </td>

                                                <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell whitespace-nowrap">
                                                    {url.alias ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-0.5 rounded-full">
                                                            <FiTag className="w-3 h-3" />
                                                            <span>{url.alias}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                                                        <FiBarChart2 className="w-3.5 h-3.5 text-blue-500" />
                                                        <span>{url.clicks.toLocaleString()}</span>
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 sm:px-6 hidden lg:table-cell whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FiCalendar className="w-3.5 h-3.5 opacity-60" />
                                                        <span>{formatDate(url.createdAt)}</span>
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDelete(url._id)}
                                                        disabled={deletingId === url._id}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                                                        title="Delete link"
                                                    >
                                                        {deletingId === url._id ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FiTrash2 className="w-3.5 h-3.5" />
                                                                <span className="hidden sm:inline">Delete</span>
                                                            </>
                                                        )}
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
