import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request) {
    try {
        const session = await getUser();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { eventId, teamName, memberTechIds } = body;

        // Validate request
        if (!eventId) {
            return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }
        if (!event.isActive) {
            return NextResponse.json({ success: false, message: "Event registration is closed" }, { status: 403 });
        }

        const leaderId = session.userId;

        // ==============================================
        // SOLO REGISTRATION
        // ==============================================
        if (event.type === "solo") {
            const existingReg = await Registration.findOne({ eventId, soloUser: leaderId });

            if (existingReg) {
                return NextResponse.json({ success: false, message: "You are already registered for this event" }, { status: 409 });
            }

            const registration = new Registration({
                eventId,
                type: "solo",
                soloUser: leaderId,
            });

            await registration.save();

            // Push to user registeredEvents
            await User.findByIdAndUpdate(leaderId, {
                $push: { registeredEvents: { eventId } },
            });

            return NextResponse.json(
                { success: true, message: "Registered successfully" },
                { status: 201 }
            );
        }

        // ==============================================
        // TEAM REGISTRATION
        // ==============================================
        if (event.type === "team") {
            if (!teamName || !memberTechIds || !Array.isArray(memberTechIds)) {
                return NextResponse.json({ success: false, message: "teamName and memberTechIds (array) are required for team events" }, { status: 400 });
            }

            const maxMembers = event.maxTeamSize - 1; // excluding leader
            const minMembers = event.minTeamSize - 1;

            if (memberTechIds.length < minMembers || memberTechIds.length > maxMembers) {
                return NextResponse.json(
                    { success: false, message: `Team size (excluding leader) must be between ${minMembers} and ${maxMembers}` },
                    { status: 400 }
                );
            }

            // Check for duplicates within the provided payload
            const uniqueTechIds = new Set(memberTechIds);
            if (uniqueTechIds.size !== memberTechIds.length) {
                return NextResponse.json(
                    { success: false, message: "Duplicate member Techexotica IDs provided" },
                    { status: 400 }
                );
            }

            const foundMembers = await User.find({ techexoticaId: { $in: memberTechIds } });
            const foundMemberIds = foundMembers.map((m) => m._id.toString());
            const foundTechIds = foundMembers.map((m) => m.techexoticaId);

            // Verify all IDs were found
            for (const techId of memberTechIds) {
                if (!foundTechIds.includes(techId)) {
                    return NextResponse.json(
                        { success: false, message: `Member ${techId} not found` },
                        { status: 400 }
                    );
                }
            }

            // Verify leader is not in members payload
            if (foundMemberIds.includes(leaderId)) {
                return NextResponse.json(
                    { success: false, message: "Leader cannot be added as a member in memberTechIds payload" },
                    { status: 400 }
                );
            }

            // Check if any user (leader included) is already registered in ANY registration doc for this event
            const allTeamUserIds = [leaderId, ...foundMemberIds];

            const conflictingRegistration = await Registration.findOne({
                eventId,
                $or: [
                    { leader: { $in: allTeamUserIds } },
                    { members: { $in: allTeamUserIds } } // Registration 'members' array will include leader, checking this array covers everyone
                ]
            });

            if (conflictingRegistration) {
                // Technically this checks if ANYONE is colliding. For UX, finding out exactly who is better but keeping it simple right now.
                return NextResponse.json(
                    { success: false, message: "One or more members (or yourself) are already registered for this event" },
                    { status: 409 }
                );
            }

            // Create Registration
            const registration = new Registration({
                eventId,
                type: "team",
                teamName,
                leader: leaderId,
                members: allTeamUserIds, // Save the full array directly
            });

            await registration.save();

            // Update all users registeredEvents arrays collectively via updateMany
            await User.updateMany(
                { _id: { $in: allTeamUserIds } },
                { $push: { registeredEvents: { eventId } } }
            );

            return NextResponse.json(
                {
                    success: true,
                    teamName: registration.teamName,
                    memberCount: allTeamUserIds.length,
                    techexoticaIds: [session.techexoticaId, ...memberTechIds]
                },
                { status: 201 }
            );
        }

        return NextResponse.json({ success: false, message: "Invalid event type" }, { status: 400 });

    } catch (error: any) {
        console.error("Event Registration Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
