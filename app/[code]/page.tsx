import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";

interface PageProps {
    params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { code } = await params;

    try {
        await connectDB();

        const urlDoc = await Url.findOneAndUpdate(
            { $or: [{ shortCode: code }, { alias: code }] },
            { $inc: { clicks: 1 } },
            { returnDocument: "after" }
        ).lean();

        if (!urlDoc) {
            notFound();
        }

        redirect((urlDoc as { originalUrl: string }).originalUrl);
    } catch (error) {
        // If it's a redirect (NEXT_REDIRECT), rethrow it
        if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        notFound();
    }
}
