import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import User from "@/models/User";
import TeamInvite from "@/models/TeamInvite";
import { getUser } from "@/lib/getUser";
import { notFound, redirect } from "next/navigation";
import TeamDashboardClient from "./TeamDashboardClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TeamDashboardPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getUser();

    if (!session) {
        redirect(`/login?redirect=/team/${id}`);
    }

    await connectDB();

    const registration = await Registration.findById(id).populate("eventId").lean();
    
    if (!registration || registration.type !== "team") {
        notFound();
    }

    // Verify user is part of the team
    const leaderId = registration.leader?.toString();
    const members = (registration.members || []).map((m: any) => m.toString());
    
    if (leaderId !== session.userId && !members.includes(session.userId)) {
        redirect("/profile");
    }

    const event = registration.eventId as any;

    // Fetch members' details
    const memberDocs = await User.find({ _id: { $in: registration.members } })
        .select("name branch batch techexoticaId phone")
        .lean();

    // Fetch pending invites to show on roster
    const pendingInvites = await TeamInvite.find({
        registrationId: registration._id,
        status: "pending"
    }).populate("toUser", "name techexoticaId").lean();

    const serializedTeam = {
        _id: registration._id.toString(),
        teamName: registration.teamName,
        teamLogo: registration.teamLogo || "",
        status: registration.status,
        leaderId: leaderId,
        members: memberDocs.map(m => ({
            _id: m._id.toString(),
            name: m.name,
            branch: m.branch,
            batch: m.batch,
            phone: m.phone || "N/A",
            techexoticaId: m.techexoticaId,
            status: "confirmed"
        })),
        pending: pendingInvites.map(inv => ({
            _id: (inv.toUser as any)._id.toString(),
            name: (inv.toUser as any).name,
            techexoticaId: (inv.toUser as any).techexoticaId,
            status: "pending"
        })),
        event: {
            name: event.name,
            minTeamSize: event.minTeamSize,
            maxTeamSize: event.maxTeamSize
        }
    };

    return (
        <div className="min-h-screen bg-[#050508] pt-20">
            <TeamDashboardClient team={serializedTeam} currentUser={session} />
        </div>
    );
}
