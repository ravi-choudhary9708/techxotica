import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

const getAdminSecret = () => process.env.ADMIN_SECRET || "techxotica-admin-2025";

function checkAuth(req: Request): boolean {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    return secret === getAdminSecret();
}

// PATCH — toggle isActive (enable/disable event)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(req)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updated = await Event.findByIdAndUpdate(
            id,
            { isActive: body.isActive },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ success: false, message: "Event not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — permanently delete event AND all related registrations
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(req)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;

        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found." }, { status: 404 });
        }

        // Delete all registrations linked to this event first
        const regResult = await Registration.deleteMany({ eventId: id });

        // Hard delete the event itself
        await Event.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: `Event "${event.name}" permanently deleted. ${regResult.deletedCount} registration(s) also removed.`,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
