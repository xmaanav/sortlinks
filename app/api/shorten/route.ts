import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";
import { nanoid } from "nanoid";
import { authenticateRequestUser } from "@/lib/session";

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function isValidAlias(alias: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(alias) && alias.length >= 2 && alias.length <= 50;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { originalUrl, alias } = body;

        if (!originalUrl || !isValidUrl(originalUrl)) {
            return NextResponse.json(
                { error: "A valid HTTP or HTTPS destination URL is required." },
                { status: 400 }
            );
        }

        if (alias && !isValidAlias(alias)) {
            return NextResponse.json(
                {
                    error:
                        "Alias must be 2-50 characters containing only letters, numbers, hyphens, and underscores.",
                },
                { status: 400 }
            );
        }

        const user = await authenticateRequestUser(request);

        await connectDB();

        if (alias) {
            const existing = await Url.findOne({ alias });
            if (existing) {
                return NextResponse.json(
                    { error: "That custom alias is already reserved. Please choose another." },
                    { status: 409 }
                );
            }
        }

        const shortCode = nanoid(7);

        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            alias: alias || undefined,
            userId: user ? user._id : null,
        });

        const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const shortUrl = `${origin}/${alias || shortCode}`;

        return NextResponse.json(
            {
                success: true,
                shortUrl,
                shortCode,
                alias: alias || null,
                originalUrl,
                id: newUrl._id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Shorten error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while shortening the link." },
            { status: 500 }
        );
    }
}
