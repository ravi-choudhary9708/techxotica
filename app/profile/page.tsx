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
            { leader: user._id },
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
            teamLogo: reg.teamLogo || "",
            role: role
        };
    }).filter(Boolean);

    const userData = {
        _id: (user._id as any).toString(),
        name: user.name,
        email: (user as any).email,
        regNo: user.regNo,
        phone: maskedPhone,
        fullPhone: user.phone, // unmasked, only sent to own profile
        batch: user.batch,
        branch: user.branch,
        techexoticaId: user.techexoticaId,
        profilePhoto: user.profilePhoto,
        registeredEvents,
        achievements: ((user as any).achievements || []).map((a: any) => ({
            _id: a._id.toString(),
            title: a.title,
            awardedAt: a.awardedAt,
        })),
    };

    return <ProfileClient user={userData} />;
}
