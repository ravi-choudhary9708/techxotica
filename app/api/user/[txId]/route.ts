import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Registration from "@/models/Registration";
import { getUser } from "@/lib/getUser";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ txId: string }> }) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { txId } = await params;
        await connectDB();

        const user = await User.findOne({ techexoticaId: txId })
            .select("name regNo techexoticaId batch branch profilePhoto achievements")
            .lean() as any;

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Get all events this user is registered for (public info only)
        const registrations = await Registration.find({
            $or: [{ soloUser: user._id }, { leader: user._id }, { members: user._id }],
        })
            .populate("eventId", "name category type")
            .select("eventId role type teamName")
            .lean() as any[];

        const events = registrations
            .filter((r: any) => r.eventId)
            .map((r: any) => ({
                eventName: r.eventId.name,
                category: r.eventId.category,
                type: r.type,
                role: r.role || "Participant",
            }));

        return NextResponse.json({
            success: true,
            data: {
                _id: user._id.toString(),
                name: user.name,
                regNo: user.regNo,
                techexoticaId: user.techexoticaId,
                batch: user.batch,
                branch: user.branch,
                profilePhoto: user.profilePhoto || "",
                achievements: user.achievements || [],
                registeredEvents: events,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
