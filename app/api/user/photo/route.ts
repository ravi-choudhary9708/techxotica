import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function POST(req: Request) {
    try {
        const session = await getUser();

        if (!session || !session.userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json(
                { success: false, message: "No image provided" },
                { status: 400 }
            );
        }

        await connectDB();

        // Upload to Cloudinary
        const photoUrl = await uploadToCloudinary(imageBase64);

        if (!photoUrl) {
            return NextResponse.json(
                { success: false, message: "Failed to upload image" },
                { status: 500 }
            );
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            session.userId,
            { profilePhoto: photoUrl },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Profile photo updated successfully",
                photoUrl,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Profile Photo Update Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
