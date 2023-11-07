import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shorten URL — ShortX",
    description:
        "Create a free short link in seconds. Add a custom alias for a branded, memorable URL. No signup required.",
};

export default function ShortenLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
