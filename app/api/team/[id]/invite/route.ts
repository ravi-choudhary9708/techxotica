import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import User from "@/models/User";
import TeamInvite from "@/models/TeamInvite";
import Event from "@/models/Event";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUser();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        const { id: registrationId } = await params;
        const { techexoticaId } = await req.json();

        if (!techexoticaId) {
            return NextResponse.json({ success: false, message: "Techexotica ID is required" }, { status: 400 });
        }

        const registration = await Registration.findById(registrationId).populate("eventId");
        if (!registration) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        if (registration.leader?.toString() !== session.userId) {
            return NextResponse.json({ success: false, message: "Only the team leader can invite members" }, { status: 403 });
        }

        const targetUser = await User.findOne({ techexoticaId: techexoticaId.toUpperCase() });
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const event = registration.eventId as any;

        // Check if total members + pending invites >= maxTeamSize
        const pendingCount = await TeamInvite.countDocuments({
            registrationId: registration._id,
            status: "pending"
        });

        const currentTotal = registration.members.length + pendingCount;
        if (currentTotal >= event.maxTeamSize) {
            return NextResponse.json({ 
                success: false, 
                message: `Cannot invite more members. Maximum team size is ${event.maxTeamSize}.` 
            }, { status: 400 });
        }

        // Check if user is already a member
        if (registration.members.includes(targetUser._id)) {
            return NextResponse.json({ success: false, message: "User is already on the team" }, { status: 400 });
        }

        // Check if user already has a pending invite for this team
        const existingInvite = await TeamInvite.findOne({
            registrationId: registration._id,
            toUser: targetUser._id,
            status: "pending"
        });

        if (existingInvite) {
            return NextResponse.json({ success: false, message: "User already has a pending invite for this team" }, { status: 400 });
        }

        // Create the invite
        const invite = new TeamInvite({
            fromUser: session.userId,
            toUser: targetUser._id,
            eventId: event._id,
            registrationId: registration._id,
            type: "event-invite",
            status: "pending"
        });

        await invite.save();

        return NextResponse.json({ 
            success: true, 
            message: "Invite sent successfully",
            invitedMember: {
                _id: targetUser._id.toString(),
                name: targetUser.name,
                techexoticaId: targetUser.techexoticaId,
                status: "pending"
            }
        });

    } catch (error: any) {
        console.error("Invite Member Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
