import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Registration from "@/models/Registration";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const adminSecret = process.env.ADMIN_SECRET || "techxotica-admin-2025";

    if (secret !== adminSecret) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        // Fetch all users, exclude password & reset token fields
        const users = await User.find({})
            .select("-password -resetPasswordToken -resetPasswordExpires")
            .sort({ createdAt: -1 })
            .lean();

        // Get registration counts per user
        const allRegistrations = await Registration.find({})
            .populate("eventId", "name category type")
            .lean();

        // Build a map: userId -> list of events registered
        const userRegMap: Record<string, { eventName: string; category: string; type: string; registeredAt: Date }[]> = {};

        for (const reg of allRegistrations as any[]) {
            const addUser = (uid: string) => {
                if (!uid) return;
                if (!userRegMap[uid]) userRegMap[uid] = [];
                if (reg.eventId) {
                    userRegMap[uid].push({
                        eventName: reg.eventId.name,
                        category: reg.eventId.category,
                        type: reg.eventId.type,
                        registeredAt: reg.registeredAt,
                    });
                }
            };
            if (reg.type === "solo" && reg.soloUser) addUser(reg.soloUser.toString());
            if (reg.type === "team") {
                if (reg.leader) addUser(reg.leader.toString());
                if (reg.members) reg.members.forEach((m: any) => addUser(m.toString()));
            }
        }

        const result = users.map((u: any) => ({
            _id: u._id.toString(),
            name: u.name,
            email: u.email,
            regNo: u.regNo,
            phone: u.phone,
            batch: u.batch,
            branch: u.branch,
            techexoticaId: u.techexoticaId || null,
            registeredEventsCount: (u.registeredEvents || []).length,
            createdAt: u.createdAt,
            eventsDetail: userRegMap[u._id.toString()] || [],
        }));

        return NextResponse.json({ success: true, data: result, total: result.length });
    } catch (error: any) {
        console.error("Admin Users Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
