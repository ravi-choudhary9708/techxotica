import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const getAdminSecret = () => process.env.ADMIN_SECRET || "techxotica-admin-2025";

// POST — add a verified achievement to a user
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(req.url);
        if (searchParams.get("secret") !== getAdminSecret()) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { title } = body;

        if (!title?.trim()) {
            return NextResponse.json({ success: false, message: "Achievement title is required" }, { status: 400 });
        }

        await connectDB();

        const user = await User.findByIdAndUpdate(
            id,
            { $push: { achievements: { title: title.trim(), awardedAt: new Date() } } },
            { new: true }
        ).select("name achievements");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `Achievement added to ${user.name}`, achievements: user.achievements });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — remove an achievement by its subdocument id
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(req.url);
        if (searchParams.get("secret") !== getAdminSecret()) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { achievementId } = body;

        if (!achievementId) {
            return NextResponse.json({ success: false, message: "achievementId is required" }, { status: 400 });
        }

        await connectDB();

        const user = await User.findByIdAndUpdate(
            id,
            { $pull: { achievements: { _id: achievementId } } },
            { new: true }
        ).select("name achievements");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Achievement removed", achievements: user.achievements });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
