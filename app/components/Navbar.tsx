"use client";

import { Home, Calendar, Gamepad2, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
        }
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Events", url: "/events", icon: Calendar },
  ];

  if (user) {
    navItems.push({ name: "Profile", url: "/profile", icon: User });
    navItems.push({ name: "Logout", url: "#logout", icon: LogOut });
  } else {
    navItems.push({ name: "Login", url: "/login", icon: LogIn });
    navItems.push({ name: "Register", url: "/register", icon: UserPlus });
  }

  return (
    <div onClick={(e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a[href="#logout"]')) {
        e.preventDefault();
        handleLogout();
      }
    }}>
      <AnimeNavBar items={navItems} defaultActive="Home" />
    </div>
  );
}
