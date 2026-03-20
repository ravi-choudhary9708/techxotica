import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { eventItems } from "@/app/data/events";

export async function GET() {
    try {
        await connectDB();

        // Do not clear existing events. updateData with upsert will handle updates
        // without breaking existing foreign key references in registrations.
        // await Event.deleteMany({});

        const results = [];

        for (const item of eventItems) {
            // Determine type and team sizes
            let type: "solo" | "team" = "solo";
            let minTeamSize = 1;
            let maxTeamSize = 1;

            if (item.teamSizeText.toLowerCase().includes("members") || item.teamSizeText.toLowerCase().includes("-")) {
                type = "team";
                const parts = item.teamSizeText.match(/\d+/g);
                if (parts) {
                    minTeamSize = parseInt(parts[0]);
                    maxTeamSize = parts.length > 1 ? parseInt(parts[1]) : minTeamSize;
                }
            } else if (item.teamSizeText.toLowerCase().includes("individual")) {
                type = "solo";
                minTeamSize = 1;
                maxTeamSize = 1;
            }

            // Parse date
            let eventDate = null;
            if (item.date.includes("-")) {
                // Multi-day event, use the first date for the Date object
                const firstDay = item.date.split("-")[0].trim();
                const monthYear = item.date.split(" ").slice(-2).join(" ");
                eventDate = new Date(`${firstDay} ${monthYear}`);
            } else {
                eventDate = new Date(item.date);
            }

            const updateData = {
                name: item.title,
                description: item.description,
                type: type,
                minTeamSize: minTeamSize,
                maxTeamSize: maxTeamSize,
                date: eventDate,
                venue: item.venue,
                prize: item.prizePool,
                category: item.category.toLowerCase(),
                isActive: true
            };

            // Update or create
            const event = await Event.findOneAndUpdate(
                { name: item.title },
                updateData,
                { upsert: true, new: true }
            );

            results.push({ name: item.title, status: "Synced" });
        }

        return NextResponse.json({ success: true, updated: results.length, data: results });
    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
