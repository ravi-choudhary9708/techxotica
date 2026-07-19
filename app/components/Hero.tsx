"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <style>{`
        @keyframes heroZoom {
          0%,100% { transform: scale(1.02); }
          50%      { transform: scale(1.06); }
        }
        @keyframes heroPulse {
          0%,100% { box-shadow: 0 0 30px rgba(251,191,36,0.45), 0 0 70px rgba(251,191,36,0.15); }
          50%      { box-shadow: 0 0 50px rgba(251,191,36,0.8),  0 0 100px rgba(251,191,36,0.3); }
        }
        @keyframes heroRing {
          0%   { transform:translate(-50%,-50%) scale(1);   opacity:0.55; }
          100% { transform:translate(-50%,-50%) scale(2.4); opacity:0; }
        }
        @keyframes heroShimmer {
          0%   { transform:translateX(-160%) skewX(-18deg); }
          100% { transform:translateX(250%)  skewX(-18deg); }
        }
        @keyframes heroFadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .hero-bg   { animation: heroZoom 18s ease-in-out infinite; will-change: transform; }
        .hero-ring { animation: heroRing 2.4s ease-out infinite; }
        .ring-d1   { animation-delay: 0s; }
        .ring-d2   { animation-delay: 0.8s; }
        .ring-d3   { animation-delay: 1.6s; }
        .hero-btn  { animation: heroPulse 2.8s ease-in-out infinite; }
        .hero-btn:hover { animation: none; }
        .hero-enter { animation: heroFadeUp 1s cubic-bezier(.16,1,.3,1) 0.3s both; }

        .hero-shimmer {
          position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%);
          transform: translateX(-160%) skewX(-18deg);
        }
        .hero-btn:hover .hero-shimmer {
          animation: heroShimmer 0.7s ease forwards;
        }
      `}</style>

      {/* ── Background image — full bleed slow zoom ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Desktop image */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: "url('/campus%20clash.png')" }}
        />
        {/* Mobile image */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat block md:hidden"
          style={{ backgroundImage: "url('/mobile.png')" }}
        />
        {/* Clean layered overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(2,4,13,0.25) 0%, rgba(2,4,13,0.55) 60%, #02040d 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(2,4,13,0.65) 100%)" }} />
      </div>

      {/* Subtle grid — low opacity, one layer only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Register button centrepiece ── */}
      {mounted && (
        <div className="hero-enter relative z-10 flex flex-col items-center gap-5">

          {/* Ripple rings */}
          <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
            {["ring-d1", "ring-d2", "ring-d3"].map((d, i) => (
              <div
                key={i}
                className={`hero-ring absolute rounded-full`}
                style={{
                  width: 170, height: 170,
                  top: "50%", left: "50%",
                  border: "1px solid rgba(251,191,36,0.4)",
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}

            {/* The button */}
            <button
              id="hero-register-btn"
              className="hero-btn relative overflow-hidden rounded-full font-orbitron font-black uppercase text-[#02040d] cursor-pointer"
              style={{
                width: 152, height: 152,
                fontSize: "0.9rem",
                letterSpacing: "0.16em",
                background: hovered
                  ? "linear-gradient(135deg,#ffe566,#fbbf24,#f59e0b)"
                  : "linear-gradient(135deg,#ffd700,#fbbf24,#f59e0b)",
                border: "2px solid rgba(251,191,36,0.5)",
                transform: hovered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1), background 0.2s ease",
              }}
              onClick={() => router.push("/register")}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="hero-shimmer" />
              <span className="relative z-10 flex flex-col items-center gap-1.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Register
              </span>
            </button>
          </div>

          {/* Subtle label */}
          <p className="font-rajdhani text-yellow-300/50 uppercase tracking-[0.4em] text-xs">
            Click to join
          </p>
        </div>
      )}

      {/* Scroll indicator */}
      {mounted && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 hidden md:flex">
          <div className="w-px h-10 bg-gradient-to-b from-yellow-400/60 to-transparent animate-bounce" />
        </div>
      )}
    </section>
  );
}
