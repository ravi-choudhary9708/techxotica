import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import User from "@/models/User";
import TeamInvite from "@/models/TeamInvite";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUser();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        const { id: registrationId } = await params;
        const { targetUserId, type } = await req.json(); // type: "confirmed" | "pending"

        if (!targetUserId || !type) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const registration = await Registration.findById(registrationId).populate("eventId");
        if (!registration) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        if (registration.leader?.toString() !== session.userId) {
            return NextResponse.json({ success: false, message: "Only the team leader can manage members" }, { status: 403 });
        }

        if (targetUserId === session.userId) {
            return NextResponse.json({ success: false, message: "Leader cannot remove themselves" }, { status: 400 });
        }

        const event = registration.eventId as any;

        if (type === "pending") {
            // Cancel a pending invite
            await TeamInvite.findOneAndDelete({
                registrationId: registration._id,
                toUser: targetUserId,
                status: "pending"
            });
            return NextResponse.json({ success: true, message: "Invite cancelled successfully" });
        } 
        else if (type === "confirmed") {
            // Remove a confirmed member
            const initialCount = registration.members.length;
            
            registration.members = registration.members.filter(
                (m: any) => m.toString() !== targetUserId
            );

            if (registration.members.length === initialCount) {
                return NextResponse.json({ success: false, message: "User is not a confirmed member" }, { status: 400 });
            }

            // If dropping below minTeamSize, revert to pending status
            if (registration.members.length < event.minTeamSize) {
                registration.status = "pending";
            }

            await registration.save();

            // Remove this event from the target user's registeredEvents
            await User.findByIdAndUpdate(targetUserId, {
                $pull: { registeredEvents: { eventId: event._id } }
            });

            return NextResponse.json({ 
                success: true, 
                message: "Member removed successfully",
                newStatus: registration.status
            });
        }
        else {
            return NextResponse.json({ success: false, message: "Invalid action type" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Remove Member Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
