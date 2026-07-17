import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";
// Need to import Event to ensure population works correctly if the model isn't registered yet
import "@/models/Event";

export async function GET() {
    try {
        const session = await getUser();

        if (!session || !session.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.userId)
            .select("-password")
            .populate({
                path: "registeredEvents.eventId",
                select: "name type date venue",
            });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Mask phone number (only show last 4 digits)
        const phoneStr = user.phone as string;
        const maskedPhone = phoneStr.length >= 4
            ? "*".repeat(phoneStr.length - 4) + phoneStr.slice(-4)
            : phoneStr;

        return NextResponse.json(
            {
                success: true,
                data: {
                    name: user.name,
                    regNo: user.regNo,
                    phone: maskedPhone,
                    batch: user.batch,
                    branch: user.branch,
                    techexoticaId: user.techexoticaId,
                    profilePhoto: user.profilePhoto,
                    registeredEvents: user.registeredEvents,
                    achievements: (user.achievements as any[] || []).map((a: any) => ({
                        _id: a._id.toString(),
                        title: a.title,
                        awardedAt: a.awardedAt,
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Profile Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getUser();

        if (!session || !session.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, phone, branch, batch } = body;

        await connectDB();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (branch) updateData.branch = branch;
        if (batch) updateData.batch = batch;

        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password").lean();

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully", data: updatedUser }, { status: 200 });

    } catch (error: any) {
        console.error("Profile Update Error", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
