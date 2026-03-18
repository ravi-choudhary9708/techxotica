import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUser";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Registration from "@/models/Registration";
import "@/models/Event";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const session = await getUser();

    if (!session || !session.userId) {
        redirect("/login");
    }

    await connectDB();

    const user = await User.findById(session.userId).select("-password").lean();

    if (!user) {
        redirect("/login");
    }

    const phoneStr = user.phone as string;
    const maskedPhone = phoneStr.length >= 4
        ? "*".repeat(phoneStr.length - 4) + phoneStr.slice(-4)
        : phoneStr;

    // We query Registration directly to get access to teamName, leader, and members
    const registrations = await Registration.find({
        $or: [
            { soloUser: user._id },
            { members: user._id }
        ]
    }).populate("eventId").lean();

    const registeredEvents = registrations.map((reg: any) => {
        const event = reg.eventId;
        if (!event) return null;

        let role = "solo";
        if (reg.type === "team") {
            role = reg.leader?.toString() === user._id.toString() ? "leader" : "member";
        }

        return {
            _id: reg._id.toString(),
            eventId: {
                id: event._id.toString(),
                name: event.title || event.name,
                type: event.type,
                date: event.date,
                venue: event.venue,
                category: (event.category || "other").toLowerCase()
            },
            teamName: reg.teamName,
            role: role
        };
    }).filter(Boolean);

    const userData = {
        name: user.name,
        regNo: user.regNo,
        phone: maskedPhone,
        batch: user.batch,
        branch: user.branch,
        techexoticaId: user.techexoticaId,
        registeredEvents
    };

    return <ProfileClient user={userData} />;
}
