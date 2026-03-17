"use client";

import { useEffect, useRef, useState } from "react";

const taglines = [
  "Ignite Innovation",
  "Engineer the Future",
  "Code. Create. Conquer.",
  "Beyond Boundaries",
];

// Fest date: April 18-19, 2026
const FEST_DATE = new Date("2026-04-18T09:00:00");

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [countdown, setCountdown] = useState(getCountdown());
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = ["#00f5ff", "#a855f7", "#ec4899", "#ffd700"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const scrollToEvents = () => {
    document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(0,245,255,0.06) 0%, rgba(168,85,247,0.04) 40%, #02040d 75%)",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} id="particle-canvas" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[rgba(0,245,255,0.3)] rounded-full px-4 py-1.5 mb-6 text-xs font-rajdhani tracking-widest uppercase text-[#00f5ff]"
          style={{ background: "rgba(0,245,255,0.05)" }}>
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
          GEC Madhubani Presents · April 18–19, 2026
        </div>

        {/* Main title */}
        <h1 className="font-orbitron font-black text-white mb-4 leading-none" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", letterSpacing: "0.05em" }}>
          TECH
          <span className="neon-text-cyan">EXOTICA</span>
        </h1>
        <p className="font-orbitron text-[rgba(0,245,255,0.7)] text-sm tracking-[0.4em] uppercase mb-6">
          Annual Technical Festival · 2026
        </p>

        {/* Typed tagline */}
        <div className="font-rajdhani text-2xl md:text-3xl text-slate-300 mb-10 h-10 flex items-center justify-center">
          <span>{typedText}</span>
          <span className="typed-cursor" />
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[
            { value: countdown.days, label: "Days" },
            { value: countdown.hours, label: "Hours" },
            { value: countdown.minutes, label: "Mins" },
            { value: countdown.seconds, label: "Secs" },
          ].map(({ value, label }) => (
            <div key={label} className="countdown-box">
              <span className="countdown-number">{String(value).padStart(2, "0")}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={scrollToContact} className="btn-neon-solid text-sm px-8 py-3">
            Register Now
          </button>
          <button onClick={scrollToEvents} className="btn-neon text-sm px-8 py-3">
            Explore Events
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
          {[
            { value: "20+", label: "Events" },
            { value: "₹1L+", label: "Prize Pool" },
            { value: "1000+", label: "Participants" },
            { value: "2", label: "Epic Days" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-orbitron font-bold text-2xl neon-text-cyan">{value}</div>
              <div className="font-rajdhani text-xs tracking-widest uppercase text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="font-rajdhani text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#00f5ff] to-transparent animate-bounce" />
      </div>
    </section>
  );
}
