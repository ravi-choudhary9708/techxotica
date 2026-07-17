import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Registration from "@/models/Registration";
import { getUser } from "@/lib/getUser";
import { uploadToCloudinary } from "@/utils/cloudinary";

export const dynamic = "force-dynamic";

// PATCH — upload team logo
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUser();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const reg = await Registration.findById(id);
        if (!reg) {
            return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
        }

        // Only the team leader can upload the logo
        if (reg.leader?.toString() !== session.userId) {
            return NextResponse.json({ success: false, message: "Only the team leader can upload a team logo" }, { status: 403 });
        }

        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json({ success: false, message: "imageBase64 is required" }, { status: 400 });
        }

        const logoUrl = await uploadToCloudinary(imageBase64, "techexotica_team_logos");

        reg.teamLogo = logoUrl;
        await reg.save();

        return NextResponse.json({ success: true, teamLogo: logoUrl });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
