import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import { getUser } from "@/lib/getUser";
import { notFound, redirect } from "next/navigation";
import EventRegistrationClient from "./EventRegistrationClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Attempt to connect to DB
    await connectDB();

    const session = await getUser();
    if (!session) {
        redirect(`/login?redirect=/events/${id}`);
    }

    // Fetch Event
    // We try to find by ID first, then by name (slugified)
    let event = null;

    // Check if id is a valid ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isObjectId) {
        event = await Event.findById(id).lean();
    }

    if (!event) {
        // Fallback: search by name matching the slug
        // e.g. "web-design" -> search for name regex /web design/i
        const nameQuery = id.split("-").join(" ");
        event = await Event.findOne({
            name: { $regex: new RegExp(`^${nameQuery}$`, "i") }
        }).lean();
    }

    if (!event) {
        notFound();
    }

    // Check if user is already registered for this event
    const userId = session.userId;
    const existingRegistration = await Registration.findOne({
        eventId: event._id,
        $or: [
            { soloUser: userId },
            { leader: userId },
            { members: userId }
        ]
    }).lean();

    // Serialize data for client component
    const serializedEvent = {
        _id: event._id.toString(),
        name: (event as any).name,
        description: (event as any).description,
        type: (event as any).type,
        minTeamSize: (event as any).minTeamSize,
        maxTeamSize: (event as any).maxTeamSize,
        date: (event as any).date ? (event as any).date.toISOString() : null,
        venue: (event as any).venue,
        prize: (event as any).prize,
        category: (event as any).category,
    };

    const serializedUser = {
        id: session.userId,
        name: session.name,
        techexoticaId: session.techexoticaId
    };

    return (
        <div className="min-h-screen bg-[#050508] pt-20">
            <EventRegistrationClient
                event={serializedEvent}
                user={serializedUser}
                isRegistered={!!existingRegistration}
            />
        </div>
    );
}
