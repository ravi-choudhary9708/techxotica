"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition-colors font-rajdhani font-bold tracking-widest text-sm uppercase"
        >
            LOGOUT
        </button>
    );
}
