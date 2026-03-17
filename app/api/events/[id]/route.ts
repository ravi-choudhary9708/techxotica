import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const { id } = params;
        const event = await Event.findById(id);

        if (!event) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: event },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Fetch Single Event Error", error);
        // If id is not a valid ObjectId, mongoose will throw CastError
        if (error.name === "CastError") {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
