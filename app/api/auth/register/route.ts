import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, regNo, phone, batch, branch, password } = body;

        // Validation
        if (!name || !email || !regNo || !phone || !batch || !branch || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        if (!/^\d{10}$/.test(phone)) {
            return NextResponse.json(
                { success: false, message: "Phone number must be exactly 10 digits" },
                { status: 400 }
            );
        }

        // Check existing
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }

        const existingReg = await User.findOne({ regNo });
        if (existingReg) {
            return NextResponse.json(
                { success: false, message: "Registration number already exists" },
                { status: 400 }
            );
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json(
                { success: false, message: "Phone number already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User({
            name,
            email,
            regNo,
            phone,
            batch,
            branch,
            password: hashedPassword,
        });

        await newUser.save();

        // Sign JWT
        const tokenPayload = {
            userId: newUser._id.toString(),
            techexoticaId: newUser.techexoticaId,
            name: newUser.name,
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
                    name: newUser.name,
                    regNo: newUser.regNo,
                    techexoticaId: newUser.techexoticaId,
                    batch: newUser.batch,
                    branch: newUser.branch,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration Error", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
