"use client";

import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WolfBanner from "./components/WolfBanner";
import { BGMISection, FreeFireSection } from "./components/WolfSection";
import AboutMadhubani from "./components/AboutMadhubani";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main
      className="min-h-screen text-slate-200"
      style={{ background: "#02040d", colorScheme: "dark" }}
    >
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <WolfBanner />
        <div className="flex flex-col gap-20 md:gap-32">
          <BGMISection />
          <FreeFireSection />
        </div>
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-20 md:py-32">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>
        <AboutMadhubani />
        <Footer />
      </div>
    </main>
  );
}
