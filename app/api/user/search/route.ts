import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim();

        if (!q || q.length < 2) {
            return NextResponse.json({ success: false, message: "Query must be at least 2 characters" }, { status: 400 });
        }

        await connectDB();

        const regex = new RegExp(q, "i");

        const users = await User.find({
            _id: { $ne: session.userId }, // exclude self
            $or: [
                { name: regex },
                { regNo: regex },
                { techexoticaId: regex },
            ],
        })
            .select("name regNo techexoticaId batch branch profilePhoto achievements")
            .limit(20)
            .lean();

        const results = users.map((u: any) => ({
            _id: u._id.toString(),
            name: u.name,
            regNo: u.regNo,
            techexoticaId: u.techexoticaId,
            batch: u.batch,
            branch: u.branch,
            profilePhoto: u.profilePhoto || "",
            achievements: u.achievements || [],
        }));

        return NextResponse.json({ success: true, data: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
