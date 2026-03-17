import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req: Request) {
    try {
        await connectDB();

        // Parse URL for optional category filter
        const { searchParams } = new URL(req.url);
        const categoryQuery = searchParams.get("category");

        const query: any = { isActive: true };

        if (categoryQuery) {
            // Regex search for case insensitive partial match if needed, but exact is fine too.
            query.category = { $regex: new RegExp(`^${categoryQuery}$`, "i") };
        }

        const events = await Event.find(query).sort({ date: 1 });

        return NextResponse.json(
            { success: true, data: events },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Fetch Events Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
