import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "sortlinks-enterprise-default-session-secret-key-32";
const secret = new TextEncoder().encode(secretKey);

export function generateSecureApiKey(): string {
    return "slk_" + crypto.randomBytes(24).toString("hex");
}

export function generateSixDigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signSessionToken(payload: { userId: string; email: string; role?: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifySessionToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: string; email: string; role?: string };
    } catch {
        return null;
    }
}
