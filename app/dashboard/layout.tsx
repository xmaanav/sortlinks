import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard — ShortX Admin",
    description: "Admin dashboard to manage, track and delete shortened links.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
