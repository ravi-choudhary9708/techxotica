"use client";

import { useEffect, useRef, useState } from "react";
import InteractiveStarfieldShader from "@/components/ui/light-up-shader";


const taglines = [
  "Ignite Innovation",
  "Engineer the Future",
  "Code. Create. Conquer.",
  "Beyond Boundaries",
];

// Fest date: March 23-24, 2026
const FEST_DATE = new Date("2026-03-23T09:00:00");

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
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <InteractiveStarfieldShader />
      </div>


      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.4)] rounded-full px-4 py-1.5 mb-6 text-xs font-rajdhani tracking-widest uppercase text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-black/40 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          GEC Madhubani Presents · March 23–24, 2026
        </div>

        {/* Main title */}
        <h1 className="font-orbitron font-black text-white mb-12 leading-none" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", letterSpacing: "0.05em", textShadow: "0 0 40px rgba(0,0,0,0.8)" }}>
          TECH
          <span className="text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">EXOTICA</span>
        </h1>

        {/* Typed tagline */}
        <div className="font-rajdhani text-2xl md:text-3xl font-semibold text-white mb-16 h-10 flex items-center justify-center drop-shadow-md">
          <span>{typedText}</span>
          <span className="typed-cursor bg-[#fbbf24] shadow-[0_0_10px_#fbbf24]" />
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3 mb-16">
          {[
            { value: countdown.days, label: "Days" },
            { value: countdown.hours, label: "Hours" },
            { value: countdown.minutes, label: "Mins" },
            { value: countdown.seconds, label: "Secs" },
          ].map(({ value, label }) => (
            <div key={label} className="countdown-box-yellow">
              <span className="countdown-number-yellow">
                {mounted ? String(value).padStart(2, "0") : "00"}
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => window.location.href = '/register'} className="btn-neon-yellow-solid text-sm px-8 py-3">
            Register Now
          </button>
          <button onClick={scrollToEvents} className="btn-neon-yellow text-sm px-8 py-3">
            Explore Events
          </button>
        </div>

      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="font-rajdhani text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#fbbf24] to-transparent animate-bounce" />
      </div>
    </section >
  );
}
