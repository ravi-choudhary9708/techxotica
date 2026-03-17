import connectDB from "@/lib/db";
import Event from "@/models/Event";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
    await connectDB();

    // Fetch all active events and gather the participantsCount which is tracked natively on the model
    const events = await Event.find({ isActive: true }).lean();

    // Serialize object IDs
    const serializedEvents = events.map(ev => ({
        ...ev,
        _id: ev._id.toString()
    }));

    return <EventsClient events={serializedEvents} />;
}
