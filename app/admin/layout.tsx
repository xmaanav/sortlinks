import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login — ShortX",
    description: "Admin login for the ShortX URL Shortener dashboard.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
