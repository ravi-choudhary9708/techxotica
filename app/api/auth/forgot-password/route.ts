import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ success: false, message: "A valid email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Return success anyway to prevent email enumeration
            return NextResponse.json({ success: true, message: "If that email is registered, a reset link has been sent." }, { status: 200 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
        
        const message = `You requested a password reset for Techexotica.\n\n` +
                        `Please go to this link to reset your password:\n\n` +
                        `${resetUrl}\n\n` +
                        `If you did not request this, please ignore this email.`;

        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; background-color: #04030a; color: #e8e0f0; padding: 20px;">
                <h2 style="color: #00c8ff;">Techexotica 2026 Password Reset</h2>
                <p>You requested a password reset for your Techexotica account.</p>
                <p>Please click the button below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00c8ff; color: #04030a; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 10px; margin-bottom: 20px;">Reset Password</a>
                <p style="font-size: 12px; color: #888;">Or copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #44b; word-wrap: break-word;">${resetUrl}</p>
                <hr style="border-color: #111; margin-top: 30px;" />
                <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail(user.email, "Techexotica Password Reset Link", message, htmlMessage);
            return NextResponse.json({ success: true, message: "Password reset link sent to your email" }, { status: 200 });
        } catch (error) {
            // Remove token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.error("Email send error", error);
            return NextResponse.json({ success: false, message: "Email could not be sent. Please try again later." }, { status: 500 });
        }
    } catch (error) {
        console.error("Forgot Password Error", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
