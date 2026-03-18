import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import User from "@/models/User";
import Event from "@/models/Event";

export async function GET() {
    try {
        await connectDB();

        // Fetch all registrations and populate relations
        const registrations = await Registration.find()
            .populate("eventId")
            .populate("soloUser")
            .populate("leader")
            .populate("members")
            .lean();

        if (!registrations || registrations.length === 0) {
            return NextResponse.json({ success: false, message: "No registrations found" }, { status: 404 });
        }

        // CSV Headers
        const headers = [
            "Event Name",
            "Category",
            "Techexotica ID",
            "Student Name",
            "Reg No",
            "Phone",
            "Batch",
            "Branch",
            "Registration Type",
            "Team Name",
            "Role"
        ];

        const rows = [headers.join(",")];

        registrations.forEach((reg: any) => {
            const eventName = reg.eventId?.title || reg.eventId?.name || "N/A";
            const category = reg.eventId?.category || "N/A";
            const regType = reg.type; // solo or team
            const teamName = reg.teamName || "N/A";

            if (regType === "solo" && reg.soloUser) {
                const u = reg.soloUser;
                const row = [
                    `"${eventName}"`,
                    `"${category}"`,
                    `"${u.techexoticaId || ""}"`,
                    `"${u.name}"`,
                    `"${u.regNo}"`,
                    `"${u.phone}"`,
                    `"${u.batch}"`,
                    `"${u.branch}"`,
                    "Solo",
                    "N/A",
                    "Solo Participant"
                ];
                rows.push(row.join(","));
            } else if (regType === "team") {
                // Add Leader
                if (reg.leader) {
                    const l = reg.leader;
                    const leaderRow = [
                        `"${eventName}"`,
                        `"${category}"`,
                        `"${l.techexoticaId || ""}"`,
                        `"${l.name}"`,
                        `"${l.regNo}"`,
                        `"${l.phone}"`,
                        `"${l.batch}"`,
                        `"${l.branch}"`,
                        "Team",
                        `"${teamName}"`,
                        "Team Leader"
                    ];
                    rows.push(leaderRow.join(","));
                }

                // Add Members
                if (reg.members && reg.members.length > 0) {
                    reg.members.forEach((m: any) => {
                        const memberRow = [
                            `"${eventName}"`,
                            `"${category}"`,
                            `"${m.techexoticaId || ""}"`,
                            `"${m.name}"`,
                            `"${m.regNo}"`,
                            `"${m.phone}"`,
                            `"${m.batch}"`,
                            `"${m.branch}"`,
                            "Team",
                            `"${teamName}"`,
                            "Team Member"
                        ];
                        rows.push(memberRow.join(","));
                    });
                }
            }
        });

        const csvContent = rows.join("\n");

        return new Response(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="techexotica_registrations.csv"',
            },
        });
    } catch (error: any) {
        console.error("CSV Export Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
