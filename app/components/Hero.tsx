"use client";

import { useEffect, useRef, useState } from "react";
import InteractiveStarfieldShader from "@/components/ui/light-up-shader";

// Fest date: March 23-24, 2026
const FEST_DATE = new Date("2026-03-23T09:00:00");

const taglines = [
  "Ignite Innovation",
  "Engineer the Future",
  "Code. Create. Conquer.",
  "Beyond Boundaries",
];

function getCountdown() {
  const now = new Date();
  const diff = FEST_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typing effect
  useEffect(() => {
    const current = taglines[taglineIdx];
    const speed = isDeleting ? 40 : 80;
    typingRef.current = setTimeout(() => {
      if (!isDeleting) {
        setTypedText((prev) => {
          if (prev.length < current.length) return current.slice(0, prev.length + 1);
          setTimeout(() => setIsDeleting(true), 1500);
          return prev;
        });
      } else {
        setTypedText((prev) => {
          if (prev.length > 0) return prev.slice(0, prev.length - 1);
          setIsDeleting(false);
          setTaglineIdx((i) => (i + 1) % taglines.length);
          return "";
        });
      }
    }, speed);
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [typedText, isDeleting, taglineIdx]);

  // Countdown & Hydration
  useEffect(() => {
    setMounted(true);
    setCountdown(getCountdown());
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const scrollToEvents = () => {
    document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-start overflow-hidden pt-36"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https://i.ibb.co/3K3j0PR/unnamed-3.png)` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <main className="relative container mx-auto h-full flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 z-10 w-full mt-10 md:mt-0 text-center">
        <div className="w-full md:w-4/5 lg:w-3/5 flex flex-col items-center pt-12 md:pt-0">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.4)] rounded-full px-4 py-1.5 mb-6 text-xs md:text-sm font-rajdhani tracking-widest uppercase text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-black/40 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
            GEC Madhubani Presents · March 23–24, 2026
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black leading-[1.1] mb-6 uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] mx-auto"
              style={{ letterSpacing: "0.05em", textShadow: "0 0 40px rgba(0,0,0,0.8)" }}>
            TECH
            <br />
            <span className="text-[#fbbf24] drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">EXOTICA 2.0</span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-lg md:text-xl lg:text-3xl font-rajdhani font-semibold text-gray-300 max-w-xl mx-auto mb-16 leading-relaxed drop-shadow-md h-10 flex items-center justify-center mt-6">
            <span>{typedText}</span>
            <span className="inline-block w-[3px] h-[1em] bg-[#fbbf24] ml-1 shadow-[0_0_10px_#fbbf24] animate-pulse" />
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-10 overflow-x-auto pb-2 w-full max-w-full">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Mins" },
              { value: countdown.seconds, label: "Secs" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center bg-black/50 border border-[#fbbf24]/30 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px] shadow-[0_0_15px_rgba(251,191,36,0.1)] backdrop-blur-md">
                <span className="text-2xl md:text-4xl font-orbitron font-bold text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {mounted ? String(value).padStart(2, "0") : "00"}
                </span>
                <span className="text-[10px] md:text-xs font-rajdhani tracking-widest uppercase text-white/80 mt-1">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-8 justify-center w-full mt-[120px]">
            <button onClick={() => window.location.href = '/register'} className="bg-[#fbbf24] text-black border border-[#fbbf24] font-orbitron font-bold px-12 py-6 rounded-md hover:bg-[#f59e0b] transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(251,191,36,0.5)] text-lg md:text-xl ml-2 mr-2">
              Register Now
            </button>
            <button onClick={scrollToEvents} className="bg-transparent border-4 border-white/50 text-white font-orbitron font-bold px-12 py-6 rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-sm text-lg md:text-xl ml-2 mr-2">
              Explore Events
            </button>
          </div>
        </div>
      </main>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-10 hidden md:flex">
        <span className="font-rajdhani text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#fbbf24] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
