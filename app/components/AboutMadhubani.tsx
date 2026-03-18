"use client";

import { useEffect, useRef } from "react";

const DEVI_IMG = "/madhubani.png";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

/* ── Section base ── */
.mh-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #07050a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 0;
}

/* ── Background glow blob ── */
.mh-blob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(210,140,60,0.08) 0%, rgba(180,60,120,0.05) 40%, transparent 70%);
  animation: mhPulse 6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes mhPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  50% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
}

/* ── Concentric rotating rings ── */
.mh-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.mh-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(210,140,60,0.07);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.mh-ring-1 { width: 600px; height: 600px; animation: mhSpin 60s linear infinite; }
.mh-ring-2 { width: 420px; height: 420px; animation: mhSpin 40s linear infinite reverse; }
.mh-ring-3 { width: 260px; height: 260px; animation: mhSpin 25s linear infinite; }
@keyframes mhSpin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }

/* ── Particles ── */
.mh-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.mh-particle {
  position: absolute;
  border-radius: 50%;
  animation: mhFloat linear infinite;
}
@keyframes mhFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
}

/* ── Scan line ── */
.mh-scan {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(210,140,60,0.5), rgba(210,140,60,0.9), rgba(210,140,60,0.5), transparent);
  animation: mhScanMove 7s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}
@keyframes mhScanMove {
  0% { top: 0; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 0.8; }
  100% { top: 100%; opacity: 0; }
}

/* ── Center divider ── */
.mh-divider-v {
  position: absolute;
  top: 10%;
  bottom: 10%;
  left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(210,140,60,0.25), rgba(180,60,120,0.2), transparent);
  pointer-events: none;
}

/* ── BG Watermarks ── */
.mh-wm {
  position: absolute;
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(80px, 12vw, 160px);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(210,140,60,0.05);
  letter-spacing: 10px;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}
.mh-wm-tl { top: 2%; left: -2%; }
.mh-wm-br { bottom: 2%; right: -2%; }

/* ── Container ── */
.mh-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  gap: 48px;
}

/* ── LEFT ── */
.mh-left {
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Tag */
.mh-tag {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0s;
}
.mh-tag-line { width: 28px; height: 2px; background: #d28c3c; }
.mh-tag-text {
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.72rem;
  color: #d28c3c;
  letter-spacing: 5px;
  text-transform: uppercase;
}

/* Title */
.mh-title { display: flex; flex-direction: column; gap: 4px; }
.mh-title-1 {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 700;
  color: #f5e8cc;
  line-height: 1;
  letter-spacing: 6px;
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.65s ease, transform 0.65s ease;
  transition-delay: 0.1s;
}
.mh-title-2 {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.4rem, 2.6vw, 2.2rem);
  font-weight: 400;
  letter-spacing: 5px;
  background: linear-gradient(90deg, #e8a040, #f0c060, #b84080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: mhShimmer 5s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.65s ease, transform 0.65s ease;
  transition-delay: 0.22s;
  transform: translateX(-40px);
}
@keyframes mhShimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.4); }
}

/* Ornament */
.mh-ornament {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.55s ease, transform 0.55s ease;
  transition-delay: 0.35s;
}
.mh-ornament-line { flex: 1; max-width: 140px; height: 1px; background: linear-gradient(90deg, #d28c3c, transparent); }
.mh-ornament-dot { color: #d28c3c; font-size: 0.8rem; }

/* About */
.mh-about {
  border-left: 2px solid rgba(210,140,60,0.45);
  padding-left: 20px;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
  transition-delay: 0.4s;
}
.mh-about-text {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(1.05rem, 1.4vw, 1.22rem);
  color: rgba(245,232,204,0.75);
  line-height: 1.9;
}
.mh-highlight { color: #e8a040; font-style: normal; font-weight: 500; }

/* Subtext */
.mh-subtext {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.82rem;
  letter-spacing: 4px;
  color: rgba(245,232,204,0.3);
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.55s ease, transform 0.55s ease;
  transition-delay: 0.48s;
}

/* Buttons */
.mh-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0.58s;
}
.mh-btn {
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.68rem;
  letter-spacing: 2px;
  padding: 13px 28px;
  cursor: pointer;
  border: none;
  clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
  transition: all 0.3s ease;
  white-space: nowrap;
}
.mh-btn-primary {
  background: linear-gradient(135deg, #d28c3c, #e8a040, #d28c3c);
  color: #07050a;
  background-size: 200%;
}
.mh-btn-primary:hover { background-position: right center; filter: brightness(1.15); }
.mh-btn-secondary {
  background: transparent;
  color: #d06080;
  border: 1px solid rgba(180,60,120,0.4);
  clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
}
.mh-btn-secondary:hover { background: rgba(180,60,120,0.1); border-color: rgba(180,60,120,0.7); }

/* ── RIGHT ── */
.mh-right {
  flex: 0 0 52%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Image wrapper */
.mh-img-wrap {
  position: relative;
  width: 100%;
  max-width: 500px;
  opacity: 0;
  transform: scale(0.94) translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.2s;
}
.mh-img {
  width: 100%;
  height: auto;
  display: block;
  animation: mhFloatImg 5s ease-in-out infinite;
  filter: drop-shadow(0 0 50px rgba(210,140,60,0.3)) drop-shadow(0 0 20px rgba(180,60,120,0.2));
}
@keyframes mhFloatImg {
  0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 50px rgba(210,140,60,0.3)) drop-shadow(0 0 20px rgba(180,60,120,0.2)); }
  50% { transform: translateY(-14px); filter: drop-shadow(0 0 70px rgba(210,140,60,0.55)) drop-shadow(0 0 35px rgba(180,60,120,0.35)); }
}

/* Frame panels */
.mh-panel {
  position: absolute;
  left: 0; right: 0;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.62rem;
  letter-spacing: 3px;
  opacity: 0;
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.mh-panel-top {
  top: -20px;
  color: #d28c3c;
  background: linear-gradient(90deg, transparent, rgba(210,140,60,0.12), transparent);
  clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 12px 100%);
  transform: translateY(-8px);
  transition-delay: 0.15s;
}
.mh-panel-bottom {
  bottom: -20px;
  color: #b84080;
  background: linear-gradient(90deg, transparent, rgba(180,60,120,0.12), transparent);
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%);
  transform: translateY(8px);
  transition-delay: 0.3s;
}
.mh-panel-line { flex: 1; height: 1px; }
.mh-panel-top .mh-panel-line { background: linear-gradient(90deg, rgba(210,140,60,0.6), transparent); }
.mh-panel-bottom .mh-panel-line { background: linear-gradient(90deg, rgba(180,60,120,0.6), transparent); }

/* Corner accents */
.mh-corner {
  position: absolute;
  width: 28px;
  height: 28px;
  opacity: 0;
  transition: opacity 0.55s ease;
}
.mh-corner-tl { top: -8px; left: -8px; border-top: 2px solid #d28c3c; border-left: 2px solid #d28c3c; transition-delay: 0.4s; }
.mh-corner-tr { top: -8px; right: -8px; border-top: 2px solid #d28c3c; border-right: 2px solid #d28c3c; transition-delay: 0.45s; }
.mh-corner-bl { bottom: -8px; left: -8px; border-bottom: 2px solid #d28c3c; border-left: 2px solid #d28c3c; transition-delay: 0.5s; }
.mh-corner-br { bottom: -8px; right: -8px; border-bottom: 2px solid #d28c3c; border-right: 2px solid #d28c3c; transition-delay: 0.55s; }

/* ── Scroll reveal "in" state ── */
.mh-in .mh-tag,
.mh-in .mh-title-1,
.mh-in .mh-title-2,
.mh-in .mh-ornament,
.mh-in .mh-about,
.mh-in .mh-subtext,
.mh-in .mh-buttons { opacity: 1; transform: none; }

.mh-in .mh-img-wrap { opacity: 1; transform: none; }

.mh-in .mh-panel { opacity: 1; transform: none; }

.mh-in .mh-corner { opacity: 1; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .mh-container {
    flex-direction: column-reverse;
    padding: 0 24px;
    gap: 32px;
  }
  .mh-left { flex: unset; width: 100%; }
  .mh-right { flex: unset; width: 100%; max-width: 340px; }
  .mh-divider-v { display: none; }
  .mh-title-1 { font-size: 2rem; }
  .mh-title-2 { font-size: 1.1rem; }
  .mh-wm { font-size: 60px; }
}
`;

// Generate particles data once (stable across renders)
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  key: i,
  size: 2 + (i % 4),
  left: `${5 + (i * 397) % 90}%`,
  top: `${10 + (i * 613) % 80}%`,
  color: i % 3 === 0 ? "rgba(210,140,60,0.7)" : i % 3 === 1 ? "rgba(180,60,120,0.6)" : "rgba(60,180,180,0.5)",
  duration: `${8 + (i * 3.7) % 12}s`,
  delay: `${(i * 1.3) % 7}s`,
}));

export default function MadhubaniSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById("mh-styles")) {
      const style = document.createElement("style");
      style.id = "mh-styles";
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById("mh-styles")?.remove();
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("mh-in"); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-madhubani" className="mh-section" ref={sectionRef}>

      {/* ── Background effects ── */}
      <div className="mh-blob" />

      <div className="mh-rings">
        <div className="mh-ring mh-ring-1" />
        <div className="mh-ring mh-ring-2" />
        <div className="mh-ring mh-ring-3" />
      </div>

      <div className="mh-particles">
        {PARTICLES.map((p) => (
          <div
            key={p.key}
            className="mh-particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="mh-scan" />
      <div className="mh-divider-v" />

      {/* Watermarks */}
      <div className="mh-wm mh-wm-tl">MADHUBANI</div>
      <div className="mh-wm mh-wm-br">TRADITION</div>

      {/* ── Main container ── */}
      <div className="mh-container">

        {/* LEFT */}
        <div className="mh-left">

          {/* Tag */}
          <div className="mh-tag">
            <span className="mh-tag-line" />
            <span className="mh-tag-text">Techexotica 2026</span>
          </div>

          {/* Title */}
          <div className="mh-title">
            <div className="mh-title-1">MADHUBANI</div>

          </div>

          {/* Ornament */}
          <div className="mh-ornament">
            <span className="mh-ornament-dot">◆</span>
            <span className="mh-ornament-line" />
            <span className="mh-ornament-dot">◆</span>
          </div>

          {/* About */}
          <div className="mh-about">
            <p className="mh-about-text">
              Born in the{" "}
              <span className="mh-highlight">Mithila region of Bihar</span>
              , Madhubani art is a 2500-year-old tradition of intricate patterns drawn from nature, mythology, and ritual — where every line carries the spirit of a goddess.
            </p>
          </div>

          {/* Subtext */}
          <p className="mh-subtext">GEC Madhubani · March 2026 · The Sacred Hall</p>

          {/* Buttons */}
          <div className="mh-buttons">
            <button
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="mh-btn mh-btn-primary"
            >
              Explore Events
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="mh-btn mh-btn-secondary"
            >
              Festival Registration
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="mh-right">
          <div className="mh-img-wrap">

            {/* Top panel */}
            <div className="mh-panel mh-panel-top">
              <span className="mh-panel-line" />
              <span>✦ The Sacred Arts ✦</span>
              <span className="mh-panel-line" style={{ background: "linear-gradient(90deg, transparent, rgba(210,140,60,0.6))" }} />
            </div>

            {/* Corner accents */}
            <div className="mh-corner mh-corner-tl" />
            <div className="mh-corner mh-corner-tr" />
            <div className="mh-corner mh-corner-bl" />
            <div className="mh-corner mh-corner-br" />

            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DEVI_IMG} alt="Madhubani Devi Goddess" className="mh-img" />

            {/* Bottom panel */}
            <div className="mh-panel mh-panel-bottom">
              <span className="mh-panel-line" style={{ background: "linear-gradient(90deg, rgba(180,60,120,0.6), transparent)" }} />
              <span>✦ Bihar Heritage ✦</span>
              <span className="mh-panel-line" style={{ background: "linear-gradient(90deg, transparent, rgba(180,60,120,0.6))" }} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
