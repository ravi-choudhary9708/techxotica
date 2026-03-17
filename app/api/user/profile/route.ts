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
                    registeredEvents: user.registeredEvents,
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
