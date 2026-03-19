"use client";

import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMadhubani from "./components/AboutMadhubani";
import Events from "./components/Events";
import ESports from "./components/ESports";
import Footer from "./components/Footer";
import AboutDeveloper from "./components/AboutDeveloper";

export default function Home() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#02040d] text-slate-200 selection:bg-[#00f5ff] selection:text-[#02040d]">
      {/* Global scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 3px, 3px 100%",
          mixBlendMode: "overlay"
        }}
      />

      {/* Dynamic starfield background */}
      <div className="fixed inset-0 min-h-screen pointer-events-none z-0 star-bg opacity-30 mix-blend-screen" />

      {/* Components */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AboutMadhubani />
        <Events />
        <ESports />
        <AboutDeveloper />
        <Footer />
      </div>
    </main>
  );
}
