"use client";

import { Home, Calendar, Gamepad2, User } from "lucide-react";
import { AnimeNavBar } from "@/components/ui/anime-navbar";

const navItems = [
  { name: "Home", url: "#home", icon: Home },
  { name: "Events", url: "#events", icon: Calendar },
  { name: "ESports", url: "#esports", icon: Gamepad2 },
  { name: "Contact", url: "#contact", icon: User },
];

export default function Navbar() {
  return <AnimeNavBar items={navItems} defaultActive="About" />;
}
