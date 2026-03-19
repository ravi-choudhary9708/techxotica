import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");
        const adminSecret = process.env.ADMIN_SECRET || "techxotica-admin-2025";

        if (secret !== adminSecret) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        // Reference User explicitly to prevent Next.js/Webpack from tree-shaking it
        if (!User) console.warn("User model not loaded");

        // Fetch all events
        const events = await Event.find().lean();

        // Fetch all registrations, fully populated
        const registrations = await Registration.find()
            .populate("eventId", "name type category date venue")
            .populate("soloUser", "name regNo techexoticaId branch batch phone")
            .populate("leader", "name regNo techexoticaId branch batch phone")
            .populate("members", "name regNo techexoticaId branch batch phone")
            .lean();

        // Group registrations by event
        const eventMap: Record<string, {
            eventId: string;
            eventName: string;
            type: string;
            category: string;
            date: string | null;
            venue: string;
            registrations: unknown[];
            totalParticipants: number;
        }> = {};

        // Initialize map with all events (even with 0 registrations)
        for (const ev of events) {
            const id = (ev._id as { toString(): string }).toString();
            eventMap[id] = {
                eventId: id,
                eventName: ev.name as string,
                type: ev.type as string,
                category: (ev.category as string) || "General",
                date: ev.date ? new Date(ev.date as Date).toISOString() : null,
                venue: (ev.venue as string) || "",
                registrations: [],
                totalParticipants: 0,
            };
        }

        // Bucket each registration into its event
        for (const reg of registrations as Array<{
            _id: { toString(): string };
            eventId: { _id: { toString(): string }; name: string; type: string; category: string; date: Date; venue: string } | null;
            type: "solo" | "team";
            teamName?: string;
            registeredAt: Date;
            status: string;
            soloUser?: { name: string; regNo: string; techexoticaId: string; branch: string; batch: string; phone: string } | null;
            leader?: { name: string; regNo: string; techexoticaId: string; branch: string; batch: string; phone: string } | null;
            members?: Array<{ name: string; regNo: string; techexoticaId: string; branch: string; batch: string; phone: string }>;
        }>) {
            if (!reg.eventId) continue;
            const eventId = reg.eventId._id.toString();

            if (!eventMap[eventId]) {
                // fallback: event was not fetched separately
                eventMap[eventId] = {
                    eventId,
                    eventName: reg.eventId.name,
                    type: reg.eventId.type,
                    category: reg.eventId.category || "General",
                    date: reg.eventId.date ? new Date(reg.eventId.date).toISOString() : null,
                    venue: reg.eventId.venue || "",
                    registrations: [],
                    totalParticipants: 0,
                };
            }

            const entry = eventMap[eventId];

            if (reg.type === "solo" && reg.soloUser) {
                entry.registrations.push({
                    registrationId: reg._id.toString(),
                    type: "solo",
                    status: reg.status,
                    registeredAt: reg.registeredAt,
                    participant: {
                        name: reg.soloUser.name,
                        regNo: reg.soloUser.regNo,
                        techexoticaId: reg.soloUser.techexoticaId,
                        branch: reg.soloUser.branch,
                        batch: reg.soloUser.batch,
                        phone: reg.soloUser.phone,
                    },
                });
                entry.totalParticipants += 1;
            } else if (reg.type === "team") {
                const members = (reg.members || []).map((m) => ({
                    name: m.name,
                    regNo: m.regNo,
                    techexoticaId: m.techexoticaId,
                    branch: m.branch,
                    batch: m.batch,
                    phone: m.phone,
                }));

                entry.registrations.push({
                    registrationId: reg._id.toString(),
                    type: "team",
                    teamName: reg.teamName || "Unnamed Team",
                    status: reg.status,
                    registeredAt: reg.registeredAt,
                    leader: reg.leader
                        ? {
                              name: reg.leader.name,
                              regNo: reg.leader.regNo,
                              techexoticaId: reg.leader.techexoticaId,
                              branch: reg.leader.branch,
                              batch: reg.leader.batch,
                              phone: reg.leader.phone,
                          }
                        : null,
                    members,
                });
                entry.totalParticipants += 1 + members.length;
            }
        }

        const result = Object.values(eventMap).sort((a, b) => a.eventName.localeCompare(b.eventName));

        return NextResponse.json({ success: true, data: result });
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Admin Participants Error:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
