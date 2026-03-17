import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.set("tx_token", "", { maxAge: 0, path: "/" });

    return NextResponse.json(
        { success: true, message: "Logged out" },
        { status: 200 }
    );
}
