import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";

export async function GET(req: Request) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const txId = searchParams.get("txId");

        if (!txId) {
            return NextResponse.json({ success: false, message: "Techexotica ID is required" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ techexoticaId: txId }).select("name techexoticaId branch batch");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                techexoticaId: user.techexoticaId,
                branch: user.branch,
                batch: user.batch
            }
        });

    } catch (error: any) {
        console.error("Find User Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
