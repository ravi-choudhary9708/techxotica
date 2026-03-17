import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { regNo, password } = await req.json();

        if (!regNo || !password) {
            return NextResponse.json(
                { success: false, message: "Registration number and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ regNo });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Sign JWT
        const tokenPayload = {
            userId: user._id.toString(),
            techexoticaId: user.techexoticaId,
            name: user.name,
        };

        const token = signToken(tokenPayload);

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("tx_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    name: user.name,
                    regNo: user.regNo,
                    techexoticaId: user.techexoticaId,
                    batch: user.batch,
                    branch: user.branch,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
