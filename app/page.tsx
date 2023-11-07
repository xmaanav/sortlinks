import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ShortX — Free URL Shortener",
  description: "Create short, shareable links instantly. No signup needed.",
};

const features = [
  { icon: "⚡", title: "Instant Creation", desc: "Shorten any URL in seconds with no setup required." },
  { icon: "🎯", title: "Custom Aliases", desc: "Use your own alias to create branded, memorable links." },
  { icon: "📊", title: "Click Tracking", desc: "See how many times each link has been visited." },
  { icon: "🔒", title: "Admin Panel", desc: "Manage all your links from a secure admin dashboard." },
  { icon: "📋", title: "One-Click Copy", desc: "Copy your short link to clipboard instantly." },
  { icon: "♾️", title: "Never Expire", desc: "Your links stay active forever, no time limits." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
            Free · No Signup · Instant
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Shorten links.<br className="hidden sm:block" /> Share everywhere.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
            Turn long, messy URLs into clean short links. Add a custom alias or let us generate one automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shorten"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Shorten a URL
            </Link>
            <Link
              href="/admin"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Demo bar */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Long URL</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
              https://example.com/very/long/url?utm_source=social&utm_campaign=launch
            </p>
          </div>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:block">→</span>
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Short link</p>
            <p className="text-sm font-semibold font-mono text-violet-600 dark:text-violet-400">shortx.io/my-link</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Everything you need
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10 text-sm">
            Simple features, no clutter.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
              >
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            How it works
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10 text-sm">Three steps. Done.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Paste your URL", d: "Enter any long URL into the shortener input." },
              { n: "2", t: "Customize (optional)", d: "Add a custom alias or let us auto-generate a code." },
              { n: "3", t: "Share your link", d: "Copy and share anywhere. Track clicks in the dashboard." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{s.t}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-xl mx-auto text-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to shorten your first link?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Free, no account needed.</p>
          <Link
            href="/shorten"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm inline-block"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold text-gray-900 dark:text-white text-sm">ShortX</span>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            © {new Date().getFullYear()} ShortX. Fast, free URL shortening.
          </p>
          <div className="flex gap-4">
            <Link href="/shorten" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-colors">Shorten</Link>
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
