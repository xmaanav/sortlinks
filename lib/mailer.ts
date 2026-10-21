export async function sendOtpEmail(to: string, otp: string, purpose: "verification" | "reset") {
    const apiKey = process.env.RESEND_API_KEY;
    const isVerification = purpose === "verification";
    const subject = isVerification
        ? `${otp} is your SortLinks verification code`
        : `${otp} is your SortLinks password reset code`;

    const title = isVerification ? "Verify Your Account" : "Reset Your Password";
    const message = isVerification
        ? "Use the 6-digit confirmation code below to verify your email address and activate your account."
        : "Use the single-use 6-digit code below to set a new password.";

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
        </head>
        <body style="font-family: sans-serif; background-color: #f9fafb; margin: 0; padding: 24px;">
            <div style="max-width: 440px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <h2 style="font-size: 18px; color: #111827; margin: 0 0 12px 0;">${title}</h2>
                <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0;">${message}</p>
                <div style="background-color: #f3f4f6; border-radius: 6px; padding: 16px; text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #111827; font-family: monospace;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">Code expires in 10 minutes. If you did not request this, please ignore.</p>
            </div>
            <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #9ca3af;">
                SortLinks &bull; Credit: MrAbhi2k3
            </div>
        </body>
        </html>
    `;

    if (!apiKey) {
        return {
            success: false,
            error: "RESEND_API_KEY is not defined in .env.local",
        };
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || "SortLinks <onboarding@resend.dev>",
                to: [to],
                subject,
                html: htmlContent,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API error:", data);
            return {
                success: false,
                error: data.message || "Failed to deliver email through Resend.",
            };
        }

        return { success: true };
    } catch (err: unknown) {
        console.error("Resend connection error:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to connect to email service.";
        return { success: false, error: errMsg };
    }
}
