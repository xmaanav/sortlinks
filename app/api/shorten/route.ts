import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/models/Url";
import { nanoid } from "nanoid";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
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
                { error: "A valid URL is required." },
                { status: 400 }
            );
        }

        if (alias && !isValidAlias(alias)) {
            return NextResponse.json(
                {
                    error:
                        "Alias must be 2-50 characters and can only contain letters, numbers, hyphens, and underscores.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        if (alias) {
            const existing = await Url.findOne({ alias });
            if (existing) {
                return NextResponse.json(
                    { error: "That alias is already taken. Please choose another." },
                    { status: 409 }
                );
            }
        }

        const shortCode = nanoid(7);

        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            alias: alias || undefined,
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const shortUrl = `${baseUrl}/${alias || shortCode}`;

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
            { error: "Internal server error. Please try again." },
            { status: 500 }
        );
    }
}
