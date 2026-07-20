import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TeamInvite from "@/models/TeamInvite";
import Registration from "@/models/Registration";
import User from "@/models/User";
import Event from "@/models/Event";
import { getUser } from "@/lib/getUser";

export const dynamic = "force-dynamic";

// PATCH — accept or decline an invite
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { action } = body; // "accept" | "decline"

        if (!["accept", "decline"].includes(action)) {
            return NextResponse.json({ success: false, message: "action must be 'accept' or 'decline'" }, { status: 400 });
        }

        await connectDB();

        const invite = await TeamInvite.findById(id);
        if (!invite) {
            return NextResponse.json({ success: false, message: "Invite not found" }, { status: 404 });
        }

        // Only the recipient can respond
        if (invite.toUser.toString() !== session.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (invite.status !== "pending") {
            return NextResponse.json({ success: false, message: "Invite already responded to" }, { status: 409 });
        }

        if (action === "decline") {
            invite.status = "declined";
            await invite.save();
            return NextResponse.json({ success: true, message: "Invite declined" });
        }

        // ── ACCEPT ──
        const reg = await Registration.findById(invite.registrationId).populate("eventId");
        if (!reg) {
            invite.status = "declined";
            await invite.save();
            return NextResponse.json({ success: false, message: "The team registration no longer exists" }, { status: 404 });
        }

        const event = reg.eventId as any;

        // Check team is not full
        if (reg.members && reg.members.length >= event.maxTeamSize) {
            invite.status = "declined";
            await invite.save();
            return NextResponse.json({ success: false, message: "Team is already full" }, { status: 400 });
        }

        // Check acceptor is not already in any team for this event
        const alreadyReg = await Registration.findOne({
            eventId: invite.eventId,
            $or: [{ soloUser: session.userId }, { leader: session.userId }, { members: session.userId }],
        });
        if (alreadyReg && alreadyReg._id.toString() !== reg._id.toString()) {
            return NextResponse.json({ success: false, message: "You are already registered for this event in another team" }, { status: 409 });
        }

        // Add acceptor to team members
        const membersArray = reg.members.map((m: any) => m.toString());
        if (!membersArray.includes(session.userId)) {
            reg.members = [...reg.members, session.userId] as any;
            
            // Check if minimum team size is met
            if (reg.members.length >= event.minTeamSize) {
                reg.status = "confirmed";
            }
            
            await reg.save();
        }

        // Add event to acceptor's registeredEvents
        await User.findByIdAndUpdate(session.userId, {
            $addToSet: { registeredEvents: { eventId: invite.eventId } },
        });

        // Mark invite accepted, decline all other pending invites from others for same event
        invite.status = "accepted";
        await invite.save();

        // Clean up other pending invites for this user for this event
        await TeamInvite.updateMany(
            { toUser: session.userId, eventId: invite.eventId, status: "pending", _id: { $ne: id } },
            { status: "declined" }
        );

        return NextResponse.json({ success: true, message: "You have joined the team!" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
