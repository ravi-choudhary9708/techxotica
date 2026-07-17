import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

export const dynamic = "force-dynamic";

const getAdminSecret = () => process.env.ADMIN_SECRET || "techxotica-admin-2025";

function checkAuth(req: Request): boolean {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    return secret === getAdminSecret();
}

// GET — list ALL events (including inactive) for admin panel
export async function GET(req: Request) {
    if (!checkAuth(req)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const events = await Event.find({}).sort({ createdAt: -1 }).lean();

        // Get registration counts per event
        const regCounts = await Registration.aggregate([
            { $group: { _id: "$eventId", count: { $sum: 1 } } }
        ]);
        const countMap: Record<string, number> = {};
        for (const r of regCounts) {
            countMap[r._id.toString()] = r.count;
        }

        const result = events.map((ev: any) => ({
            ...ev,
            _id: ev._id.toString(),
            registrationCount: countMap[ev._id.toString()] || 0,
        }));

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — add a new event
export async function POST(req: Request) {
    if (!checkAuth(req)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const body = await req.json();

        const {
            name, description, type, minTeamSize, maxTeamSize,
            date, venue, prize, category, isActive, allowedRoles
        } = body;

        if (!name || !type) {
            return NextResponse.json(
                { success: false, message: "Event name and type are required." },
                { status: 400 }
            );
        }

        // Prevent duplicate names
        const existing = await Event.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "An event with this name already exists." },
                { status: 409 }
            );
        }

        const newEvent = await Event.create({
            name: name.trim(),
            description: description?.trim() || "",
            type: type === "team" ? "team" : "solo",
            minTeamSize: type === "team" ? (minTeamSize || 2) : 1,
            maxTeamSize: type === "team" ? (maxTeamSize || 4) : 1,
            date: date ? new Date(date) : undefined,
            venue: venue?.trim() || "",
            prize: prize?.trim() || "",
            category: category?.trim().toLowerCase() || "general",
            allowedRoles: Array.isArray(allowedRoles) && allowedRoles.length > 0 ? allowedRoles : ["Participant"],
            isActive: isActive !== false,
        });

        return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
