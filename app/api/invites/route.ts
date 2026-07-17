import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TeamInvite from "@/models/TeamInvite";
import Registration from "@/models/Registration";
import User from "@/models/User";
import Event from "@/models/Event";
import { getUser } from "@/lib/getUser";

export const dynamic = "force-dynamic";

// GET — fetch pending invites for the current user
export async function GET() {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const invites = await TeamInvite.find({ toUser: session.userId, status: "pending" })
            .populate("fromUser", "name techexoticaId profilePhoto")
            .populate("eventId", "name category type")
            .populate("registrationId", "teamName teamLogo")
            .sort({ createdAt: -1 })
            .lean();

        const result = invites.map((inv: any) => ({
            _id: inv._id.toString(),
            type: inv.type,
            status: inv.status,
            createdAt: inv.createdAt,
            from: {
                name: inv.fromUser?.name,
                techexoticaId: inv.fromUser?.techexoticaId,
                profilePhoto: inv.fromUser?.profilePhoto || "",
            },
            event: {
                name: inv.eventId?.name,
                category: inv.eventId?.category,
                type: inv.eventId?.type,
            },
            team: {
                teamName: inv.registrationId?.teamName,
                teamLogo: inv.registrationId?.teamLogo || "",
                registrationId: inv.registrationId?._id?.toString(),
            },
        }));

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — send an invite
export async function POST(req: Request) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { toTxId, eventId, registrationId } = body;

        if (!toTxId || !eventId || !registrationId) {
            return NextResponse.json({ success: false, message: "toTxId, eventId, and registrationId are required" }, { status: 400 });
        }

        // Verify sender is the team leader for this registration
        const reg = await Registration.findById(registrationId).populate("eventId");
        if (!reg) {
            return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
        }
        if (reg.leader?.toString() !== session.userId) {
            return NextResponse.json({ success: false, message: "Only the team leader can send invites" }, { status: 403 });
        }
        if (!reg.teamName) {
            return NextResponse.json({ success: false, message: "Please set a team name before inviting players" }, { status: 400 });
        }

        // Check team is not already full
        const event = reg.eventId as any;
        if (reg.members && reg.members.length >= event.maxTeamSize) {
            return NextResponse.json({ success: false, message: "Team is already full" }, { status: 400 });
        }

        // Find the target user
        const toUser = await User.findOne({ techexoticaId: toTxId }).lean() as any;
        if (!toUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const toUserId = toUser._id.toString();

        // Don't invite self or existing members
        if (toUserId === session.userId) {
            return NextResponse.json({ success: false, message: "You cannot invite yourself" }, { status: 400 });
        }
        if (reg.members?.map((m: any) => m.toString()).includes(toUserId)) {
            return NextResponse.json({ success: false, message: "This user is already in your team" }, { status: 409 });
        }

        // Determine invite type
        const existingReg = await Registration.findOne({
            eventId,
            $or: [{ soloUser: toUserId }, { leader: toUserId }, { members: toUserId }],
        });
        const inviteType = existingReg ? "join-team" : "event-invite";

        // Prevent duplicate pending invite
        const existing = await TeamInvite.findOne({ fromUser: session.userId, toUser: toUserId, eventId, status: "pending" });
        if (existing) {
            return NextResponse.json({ success: false, message: "You already sent a pending invite to this user for this event" }, { status: 409 });
        }

        const invite = await TeamInvite.create({
            fromUser: session.userId,
            toUser: toUserId,
            eventId,
            registrationId,
            type: inviteType,
            status: "pending",
        });

        return NextResponse.json({ success: true, message: "Invite sent!", inviteId: invite._id.toString() }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
