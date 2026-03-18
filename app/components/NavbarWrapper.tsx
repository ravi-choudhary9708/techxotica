"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function NavbarWrapper() {
    const pathname = usePathname();

    // Don't render the Navbar on admin routes
    if (pathname.startsWith("/admin")) return null;

    return <Navbar />;
}
