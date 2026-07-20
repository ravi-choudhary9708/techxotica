"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────
   Shared reusable GameSection component
   Clean, spacious, minimal-noise design
───────────────────────────────────────── */

type Stat = { label: string; value: string };

type GameSectionProps = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;     // primary colour hex
  accent2: string;    // secondary colour hex
  stats: Stat[];
  description: string;
  ctaLabel: string;
  ctaUrl?: string;
  scanTag: string;
  flip?: boolean;
};

function GameSection({
  id, imageSrc, imageAlt, eyebrow,
  title, subtitle, accent, accent2,
  stats, description, ctaLabel, ctaUrl = "/events", scanTag, flip = false,
}: GameSectionProps) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Inline keyframe names are scoped by id to avoid collisions */
  const kfLeft  = `${id}-left`;
  const kfRight = `${id}-right`;
  const kfLine  = `${id}-line`;
  const kfZoom  = `${id}-zoom`;

  return (
    <section
      id={id}
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#02040d" }}
    >
      <style>{`
        @keyframes ${kfLeft}  { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ${kfRight} { from { opacity:0; transform:translateX( 40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ${kfLine}  { from { width:0; } to { width:100%; } }
        @keyframes ${kfZoom}  { 0%,100%{transform:scale(1.03);} 50%{transform:scale(1.07);} }

        #${id} .gs-img-wrap  { animation:${kfZoom} 16s ease-in-out infinite; }
        #${id} .gs-img-col   { animation:${kfLeft}  0.8s cubic-bezier(.16,1,.3,1) ${flip ? "0.12s" : "0s"} both; }
        #${id} .gs-txt-col   { animation:${kfRight} 0.8s cubic-bezier(.16,1,.3,1) ${flip ? "0s" : "0.12s"} both; }
        #${id} .gs-underline { animation:${kfLine}  0.7s ease 0.55s both; }

        #${id} .gs-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          transition: border-color 0.25s, transform 0.25s;
        }
        #${id} .gs-stat:hover {
          border-color: ${accent}55;
          transform: translateY(-2px);
        }

        #${id} .gs-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s;
        }
        #${id} .gs-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 40px ${accent}88;
        }
        #${id} .gs-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%);
          transform:translateX(-160%) skewX(-18deg);
        }
        #${id} .gs-btn:hover::after {
          transition:transform 0.55s ease;
          transform:translateX(200%) skewX(-18deg);
        }
      `}</style>

      {/* Subtle single ambient glow — not competing */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 480, height: 480, borderRadius: "50%",
          top: flip ? "auto" : "-8%",
          bottom: flip ? "-8%" : "auto",
          right: flip ? "auto" : "-8%",
          left: flip ? "-8%" : "auto",
          background: `radial-gradient(circle, ${accent}0c 0%, transparent 70%)`,
        }}
      />

      {/* Hairline top separator */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}30, ${accent2}30, transparent)` }} />

      {/* ── Main content ── */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-32 lg:py-48">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center ${flip ? "lg:grid-flow-dense" : ""}`}>

          {/* IMAGE */}
          <div
            className={`gs-img-col relative ${vis ? "" : "opacity-0"} ${flip ? "lg:col-start-2" : ""}`}
          >
            {/* Frame */}
            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                border: `1px solid ${accent}30`,
                boxShadow: `0 0 0 1px ${accent}15, 0 24px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Slow-zoom image */}
              <div className="gs-img-wrap">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full block"
                  style={{ filter: "brightness(0.9) contrast(1.08) saturate(1.1)", aspectRatio: "16/10", objectFit: "cover" }}
                />
              </div>

              {/* Bottom gradient fade */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, #02040d 0%, transparent 50%)" }} />
              {/* Side vignettes */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, #02040d 0%, transparent 18%, transparent 82%, #02040d 100%)" }} />

              {/* Bottom label strip */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-12" style={{ background: "linear-gradient(to top, rgba(2,4,13,0.95) 0%, transparent 100%)" }}>
                <p className="text-[9px] font-mono tracking-[4px] uppercase mb-1" style={{ color: accent }}>{scanTag}</p>
                <p className="font-orbitron font-black text-white text-sm uppercase tracking-widest">{title}</p>
              </div>

              {/* Corner dots */}
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: accent2, boxShadow: `0 0 8px ${accent2}` }} />
            </div>
          </div>

          {/* TEXT */}
          <div
            className={`gs-txt-col flex flex-col gap-7 min-w-0 ${vis ? "" : "opacity-0"} ${flip ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            {/* Eyebrow */}
            <p className="flex items-center gap-3 text-xs font-rajdhani tracking-[0.4em] uppercase" style={{ color: accent }}>
              <span className="w-5 h-px flex-shrink-0" style={{ background: accent }} />
              {eyebrow}
            </p>

            {/* Title */}
            <div className="min-w-0">
              <h2
                className="font-black uppercase leading-[1.05]"
                style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", letterSpacing: "-0.01em" }}
              >
                <span className="block text-white">{title}</span>
                <span
                  className="block"
                  style={{
                    background: `linear-gradient(130deg, ${accent} 0%, ${accent2} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {subtitle}
                </span>
              </h2>
              <div
                className="gs-underline h-[2px] mt-3 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accent2}, transparent)`,
                  ...(vis ? {} : { width: 0 }),
                }}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="gs-stat px-4 py-3.5">
                  <div
                    className="text-[9px] font-rajdhani tracking-[3px] uppercase mb-1.5"
                    style={{ color: i % 2 === 0 ? accent : accent2 }}
                  >
                    {s.label}
                  </div>
                  <div className="text-sm font-bold font-orbitron text-white">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p
              className="text-slate-400 leading-[1.8] font-rajdhani"
              style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)" }}
            >
              {description}
            </p>

            {/* CTA */}
            <button
              className="gs-btn self-start px-10 py-5 font-orbitron font-bold uppercase rounded-lg text-[#02040d] cursor-pointer shadow-lg"
              onClick={() => (window.location.href = ctaUrl)}
              style={{
                fontSize: "1rem",
                letterSpacing: "0.2em",
                background: `linear-gradient(130deg, ${accent} 0%, ${accent2} 100%)`,
                boxShadow: `0 0 30px ${accent}88`,
              }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── BGMI ────── */
export function BGMISection() {
  return (
    <GameSection
      id="bgmi-tournament"
      imageSrc="/bgmi.png"
      imageAlt="BGMI Tournament"
      eyebrow="E-Sports · Battle Royale"
      title="BGMI"
      subtitle="Tournament"
      accent="#00f5ff"
      accent2="#a855f7"
      stats={[
        { label: "Format", value: "Battle Royale" },
        { label: "Status", value: "Open Now"       },
        { label: "Mode",   value: "Solo / Squad"   },
        { label: "Prize",  value: "Cash + Goodies" },
      ]}
      description="Drop in. Survive. Dominate. High-stakes squad combat on the college stage — where only the sharpest team takes the Chicken Dinner. Form your squad, land smart, and fight to be the last one standing."
      ctaLabel="Register Squad"
      ctaUrl="/events/bgmi"
      scanTag="Zone Active"
      flip={false}
    />
  );
}

/* ────── Free Fire ────── */
export function FreeFireSection() {
  return (
    <GameSection
      id="freefire-tournament"
      imageSrc="/freefire.png"
      imageAlt="Free Fire Tournament"
      eyebrow="E-Sports · Survival Shooter"
      title="Free Fire"
      subtitle="Showdown"
      accent="#f97316"
      accent2="#fbbf24"
      stats={[
        { label: "Format", value: "Battle Royale" },
        { label: "Status", value: "Open Now"       },
        { label: "Mode",   value: "Solo / Duo"     },
        { label: "Prize",  value: "Cash + Goodies" },
      ]}
      description="Load up. Gear up. Wipe them out. Free Fire Showdown is the ultimate mobile battle arena — 50 players drop in, only one squad survives. Strategy, speed, and raw firepower decide who walks away with the crown."
      ctaLabel="Register Now"
      ctaUrl="/events/free-fire"
      scanTag="Combat Zone"
      flip={true}
    />
  );
}

export default BGMISection;
