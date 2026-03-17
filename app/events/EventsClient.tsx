"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["all", "technical", "cultural", "gaming"];
const TYPES = ["all", "solo", "team"];

const CAT: Record<string, any> = {
  technical: { color: "#00c8ff", border: "rgba(0,200,255,0.3)", bg: "rgba(0,200,255,0.06)", glow: "rgba(0,200,255,0.35)", icon: "⬡" },
  cultural: { color: "#d28c3c", border: "rgba(210,140,60,0.3)", bg: "rgba(210,140,60,0.06)", glow: "rgba(210,140,60,0.35)", icon: "◈" },
  gaming: { color: "#c06080", border: "rgba(180,60,120,0.3)", bg: "rgba(180,60,120,0.06)", glow: "rgba(180,60,120,0.35)", icon: "◉" },
  other: { color: "#a0a0a0", border: "rgba(160,160,160,0.3)", bg: "rgba(160,160,160,0.06)", glow: "rgba(160,160,160,0.35)", icon: "◬" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ev-root {
    min-height: 100vh;
    background: #050508;
    color: #e8e0f0;
    font-family: 'Barlow Condensed', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Grid bg ── */
  .ev-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Glows ── */
  .ev-glow-1 {
    position: fixed; top: -150px; left: 20%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: ev-gp 9s ease-in-out infinite;
  }
  .ev-glow-2 {
    position: fixed; bottom: -150px; right: 10%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(180,60,120,0.05) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: ev-gp 9s ease-in-out infinite 4.5s;
  }
  @keyframes ev-gp {
    0%,100% { transform: scale(1); opacity: 0.6; }
    50%      { transform: scale(1.15); opacity: 1; }
  }

  /* ── Scanline ── */
  .ev-scan {
    position: fixed; left: 0; right: 0; height: 2px; top: -2px;
    background: linear-gradient(to right, transparent, rgba(0,200,255,0.2), transparent);
    z-index: 100; pointer-events: none;
    animation: ev-scanline 9s linear infinite 2s;
  }
  @keyframes ev-scanline {
    0%   { top:-2px; opacity:0; }
    3%   { opacity:1; }
    97%  { opacity:0.2; }
    100% { top:100vh; opacity:0; }
  }

  /* ── Container ── */
  .ev-container {
    position: relative; z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 24px 100px;
  }

  /* ── Hero header ── */
  .ev-hero {
    text-align: center;
    margin-bottom: 56px;
    opacity: 0; transform: translateY(-20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .ev-hero.ev-in { opacity: 1; transform: translateY(0); }

  .ev-hero-eyebrow {
    font-size: 11px; font-weight: 600;
    letter-spacing: 6px; color: #00c8ff;
    text-transform: uppercase; margin-bottom: 16px;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  }
  .ev-hero-eyebrow::before,
  .ev-hero-eyebrow::after {
    content: ''; display: inline-block;
    width: 40px; height: 1px;
    background: linear-gradient(to right, transparent, #00c8ff);
  }
  .ev-hero-eyebrow::after {
    background: linear-gradient(to left, transparent, #00c8ff);
  }

  .ev-hero-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(42px, 6vw, 80px);
    font-weight: 700; line-height: 0.95;
    letter-spacing: 2px; text-transform: uppercase;
    color: #f0e8ff;
  }
  .ev-hero-title span {
    display: block;
    background: linear-gradient(135deg, #00c8ff 0%, #0080ff 50%, #c06080 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ev-title-shimmer 6s ease-in-out infinite;
  }
  @keyframes ev-title-shimmer {
    0%,100% { filter: brightness(1); }
    50%      { filter: brightness(1.2) drop-shadow(0 0 12px rgba(0,200,255,0.4)); }
  }

  .ev-hero-sub {
    font-size: 15px; color: rgba(255,255,255,0.35);
    letter-spacing: 3px; margin-top: 12px;
    text-transform: uppercase;
  }

  /* ── Stats row ── */
  .ev-stats-row {
    display: flex; justify-content: center; gap: 0;
    margin-top: 32px; border: 1px solid rgba(255,255,255,0.06);
    max-width: 480px; margin-left: auto; margin-right: auto;
  }
  .ev-hero-stat {
    flex: 1; padding: 14px 20px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .ev-hero-stat:last-child { border-right: none; }
  .ev-hero-stat-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 22px; color: #00c8ff; display: block;
  }
  .ev-hero-stat-label {
    font-size: 10px; letter-spacing: 2px;
    color: rgba(255,255,255,0.3); text-transform: uppercase;
    margin-top: 3px; display: block;
  }

  /* ── Controls bar ── */
  .ev-controls {
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    margin-bottom: 32px;
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease;
  }
  .ev-controls.ev-in { opacity: 1; transform: translateY(0); }

  .ev-filter-group {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .ev-filter-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 7px 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  }
  .ev-filter-btn:hover {
    border-color: rgba(0,200,255,0.35);
    color: rgba(0,200,255,0.85);
    background: rgba(0,200,255,0.04);
  }
  .ev-filter-btn.active {
    background: rgba(0,200,255,0.1);
    border-color: rgba(0,200,255,0.45);
    color: #00c8ff;
  }
  .ev-filter-btn.cat-cultural.active {
    background: rgba(210,140,60,0.1);
    border-color: rgba(210,140,60,0.45);
    color: #d28c3c;
  }
  .ev-filter-btn.cat-gaming.active {
    background: rgba(180,60,120,0.1);
    border-color: rgba(180,60,120,0.45);
    color: #c06080;
  }

  .ev-divider-v {
    width: 1px; height: 28px;
    background: rgba(255,255,255,0.1);
  }

  .ev-results-count {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; color: rgba(0,200,255,0.45);
    letter-spacing: 1px; margin-left: auto;
  }

  /* ── Events grid ── */
  .ev-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }
  @media (max-width: 768px) {
    .ev-grid { grid-template-columns: 1fr; }
  }

  /* ── Event card ── */
  .ev-card {
    position: relative;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    overflow: hidden;
    display: flex; flex-direction: column;
    cursor: auto;
    transition: border-color 0.3s, transform 0.25s, background 0.3s;
    opacity: 0; transform: translateY(28px) scale(0.98);
  }
  .ev-card.ev-in {
    opacity: 1; transform: translateY(0) scale(1);
  }
  .ev-card:hover {
    border-color: var(--c-border, rgba(0,200,255,0.3));
    background: rgba(255,255,255,0.04);
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px var(--c-glow, rgba(0,200,255,0.08));
  }

  /* Top corner cut */
  .ev-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    border-style: solid;
    border-width: 0 24px 24px 0;
    border-color: transparent #050508 transparent transparent;
    z-index: 3;
    transition: border-color 0s;
  }
  /* Corner accent line */
  .ev-card-corner {
    position: absolute; top: 0; right: 0;
    width: 24px; height: 24px; z-index: 4;
    border-top: 1px solid var(--c-color, #00c8ff);
    border-right: 1px solid var(--c-color, #00c8ff);
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .ev-card:hover .ev-card-corner { opacity: 1; }

  /* Bottom left accent */
  .ev-card-bl {
    position: absolute; bottom: 0; left: 0;
    width: 16px; height: 16px; z-index: 4;
    border-bottom: 1px solid var(--c-color, #00c8ff);
    border-left: 1px solid var(--c-color, #00c8ff);
    opacity: 0.3;
    transition: opacity 0.3s;
  }
  .ev-card:hover .ev-card-bl { opacity: 0.7; }

  /* Shimmer sweep */
  .ev-card-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.025) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    pointer-events: none; z-index: 2;
  }
  .ev-card:hover .ev-card-shimmer { transform: translateX(100%); }

  /* Top color bar */
  .ev-card-bar {
    height: 2px;
    background: linear-gradient(to right, var(--c-color, #00c8ff), transparent);
    box-shadow: 0 0 10px var(--c-glow, rgba(0,200,255,0.4));
  }

  /* Card body */
  .ev-card-body { padding: 22px 22px 0; flex: 1; }

  .ev-card-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px;
    margin-bottom: 14px;
  }

  .ev-card-icon {
    width: 42px; height: 42px; flex-shrink: 0;
    border: 1px solid var(--c-border, rgba(0,200,255,0.3));
    background: var(--c-bg, rgba(0,200,255,0.06));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: background 0.3s;
  }
  .ev-card:hover .ev-card-icon {
    background: var(--c-bg-h, rgba(0,200,255,0.12));
  }

  .ev-card-badges { display: flex; gap: 5px; flex-wrap: wrap; }
  .ev-badge {
    font-size: 9px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 9px; border: 1px solid;
  }

  .ev-card-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 22px; font-weight: 700;
    color: #f0e8ff; letter-spacing: 0.5px;
    line-height: 1.15; margin-bottom: 10px;
    transition: color 0.3s;
  }
  .ev-card:hover .ev-card-name { color: #fff; }

  .ev-card-desc {
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.4);
    line-height: 1.6; margin-bottom: 18px;
    letter-spacing: 0.3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Meta grid */
  .ev-card-meta {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-bottom: 18px;
  }
  .ev-meta-item {
    display: flex; flex-direction: column; gap: 2px;
  }
  .ev-meta-key {
    font-size: 9px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
  .ev-meta-val {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px; font-weight: 600;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.5px;
  }

  /* Prize highlight */
  .ev-prize-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 15px;
    color: var(--c-color, #00c8ff);
    text-shadow: 0 0 12px var(--c-glow, rgba(0,200,255,0.4));
  }

  /* Registrations bar */
  .ev-reg-bar-wrap {
    padding: 0 22px; margin-bottom: 0;
  }
  .ev-reg-label {
    display: flex; justify-content: space-between;
    font-size: 10px; letter-spacing: 1px;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase; margin-bottom: 6px;
  }
  .ev-reg-label span { color: var(--c-color, #00c8ff); }
  .ev-reg-track {
    height: 2px; background: rgba(255,255,255,0.06);
    position: relative; overflow: hidden;
  }
  .ev-reg-fill {
    height: 100%;
    background: linear-gradient(to right, var(--c-color, #00c8ff), transparent);
    box-shadow: 0 0 6px var(--c-glow, rgba(0,200,255,0.4));
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Card footer */
  .ev-card-footer {
    margin-top: 18px;
    padding: 14px 22px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center;
    justify-content: space-between; gap: 12px;
  }

  .ev-team-info {
    font-size: 11px; letter-spacing: 1px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
  }
  .ev-team-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--c-color, #00c8ff);
    animation: ev-dot-pulse 2s ease-in-out infinite;
  }
  @keyframes ev-dot-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.7); }
  }

  .ev-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    padding: 8px 22px;
    background: transparent;
    border: 1px solid var(--c-border, rgba(0,200,255,0.3));
    color: var(--c-color, #00c8ff);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
    position: relative; overflow: hidden;
  }
  .ev-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--c-bg, rgba(0,200,255,0.06));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s ease;
  }
  .ev-btn:hover::before { transform: scaleX(1); }
  .ev-btn:hover {
    border-color: var(--c-color, #00c8ff);
    box-shadow: 0 0 16px var(--c-glow, rgba(0,200,255,0.25));
  }
  .ev-btn span { position: relative; z-index: 1; text-align: center; display: inline-block; width: 100%;}
  .ev-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }

  /* ── Date dividers ── */
  .ev-date-divider {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 14px;
    margin: 8px 0 -4px;
    opacity: 0; transform: translateX(-16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .ev-date-divider.ev-in { opacity: 1; transform: translateX(0); }
  .ev-date-divider-line {
    flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);
  }
  .ev-date-divider-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 3px;
    color: rgba(255,255,255,0.2); text-transform: uppercase;
  }

  /* ── Empty state ── */
  .ev-empty {
    grid-column: 1/-1;
    padding: 80px 24px; text-align: center;
    border: 1px dashed rgba(255,255,255,0.07);
  }
  .ev-empty-icon { font-size: 40px; opacity: 0.2; margin-bottom: 16px; }
  .ev-empty-txt {
    font-size: 14px; letter-spacing: 2px;
    color: rgba(255,255,255,0.2); text-transform: uppercase;
  }
`;

export default function EventsClient({ events }: { events: any[] }) {
  const [visible, setVisible] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filledBars, setFilledBars] = useState(false);
  const gridRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!document.getElementById("ev-styles")) {
      const el = document.createElement("style");
      el.id = "ev-styles";
      el.textContent = styles;
      document.head.appendChild(el);
    }
    setTimeout(() => setVisible(true), 80);
    setTimeout(() => setFilledBars(true), 600);
  }, []);

  const filtered = events.filter(ev => {
    const evCat = (ev.category || "other").toLowerCase();
    if (catFilter !== "all" && evCat !== catFilter) return false;
    if (typeFilter !== "all" && ev.type !== typeFilter) return false;
    return true;
  });

  const cx = (...a: any[]) => a.filter(Boolean).join(" ");

  // Derive stats
  const totalRegs = events.reduce((s, e) => s + (e.participantsCount || 0), 0);
  const maxReg = Math.max(1, ...events.map(e => e.participantsCount || 0));

  return (
    <div className="ev-root">
      <div className="ev-glow-1" />
      <div className="ev-glow-2" />
      <div className="ev-scan" />

      <div className="ev-container">

        {/* ── Hero ── */}
        <div className={cx("ev-hero", visible && "ev-in")}>
          <div className="ev-hero-eyebrow">Techexotica 2026</div>
          <div className="ev-hero-title">
            All<br /><span>Events</span>
          </div>
          <div className="ev-hero-sub">GEC Madhubani · March 2026</div>
          <div className="ev-stats-row">
            <div className="ev-hero-stat">
              <span className="ev-hero-stat-num">{events.length}</span>
              <span className="ev-hero-stat-label">Events</span>
            </div>
            <div className="ev-hero-stat">
              <span className="ev-hero-stat-num">{totalRegs}</span>
              <span className="ev-hero-stat-label">Registered</span>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className={cx("ev-controls", visible && "ev-in")}>
          <div className="ev-filter-group">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={cx(
                  "ev-filter-btn",
                  `cat-${c}`,
                  catFilter === c && "active"
                )}
              >
                {c === "all" ? "All" : `${CAT[c]?.icon || "◬"} ${c}`}
              </button>
            ))}
          </div>
          <div className="ev-divider-v" />
          <div className="ev-filter-group">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cx("ev-filter-btn", typeFilter === t && "active")}
              >
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
          <span className="ev-results-count">
            {String(filtered.length).padStart(2, "0")} / {String(events.length).padStart(2, "0")} events
          </span>
        </div>

        {/* ── Grid ── */}
        <div className="ev-grid" ref={gridRef}>
          {filtered.length === 0 ? (
            <div className="ev-empty">
              <div className="ev-empty-icon">◈</div>
              <div className="ev-empty-txt">No events match your filters</div>
            </div>
          ) : (
            filtered.map((ev, i) => {
              const catString = (ev.category || "other").toLowerCase();
              const c = CAT[catString] || CAT.other;
              const fillPct = filledBars ? Math.min(100, Math.round(((ev.participantsCount || 0) / maxReg) * 100)) : 0;
              const date = ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "TBA";

              return (
                <div
                  key={ev._id}
                  className={cx("ev-card", visible && "ev-in")}
                  style={{
                    "--c-color": c.color,
                    "--c-border": c.border,
                    "--c-bg": c.bg,
                    "--c-bg-h": c.bg.replace("0.06", "0.12"),
                    "--c-glow": c.glow,
                    transitionDelay: `${0.1 + i * 0.07}s`,
                  } as any}
                >
                  <div className="ev-card-corner" />
                  <div className="ev-card-bl" />
                  <div className="ev-card-shimmer" />
                  <div className="ev-card-bar" />

                  <div className="ev-card-body">
                    <div className="ev-card-header">
                      <div className="ev-card-icon">{c.icon}</div>
                      <div className="ev-card-badges">
                        <span className="ev-badge" style={{ color: c.color, borderColor: c.border, background: c.bg }}>
                          {catString}
                        </span>
                        <span className="ev-badge" style={{
                          color: ev.type === "team" ? "#d28c3c" : "rgba(255,255,255,0.35)",
                          borderColor: ev.type === "team" ? "rgba(210,140,60,0.3)" : "rgba(255,255,255,0.1)",
                          background: ev.type === "team" ? "rgba(210,140,60,0.06)" : "transparent",
                        }}>
                          {ev.type}
                        </span>
                      </div>
                    </div>

                    <div className="ev-card-name">{ev.title || ev.name}</div>
                    <div className="ev-card-desc">{ev.description}</div>

                    <div className="ev-card-meta">
                      <div className="ev-meta-item">
                        <span className="ev-meta-key">Date</span>
                        <span className="ev-meta-val">◷ {date}</span>
                      </div>
                      <div className="ev-meta-item">
                        <span className="ev-meta-key">Venue</span>
                        <span className="ev-meta-val">◈ {ev.venue || "TBA"}</span>
                      </div>
                      <div className="ev-meta-item" style={{ gridColumn: "1/-1" }}>
                        <span className="ev-meta-key">Team Size</span>
                        <span className="ev-meta-val">
                          {ev.type === "solo" ? "Solo" : `${ev.teamSize?.min || 1}–${ev.teamSize?.max || 4} Members`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registrations bar */}
                  <div className="ev-reg-bar-wrap">
                    <div className="ev-reg-label">
                      <span>Registrations</span>
                      <span>{ev.participantsCount || 0}</span>
                    </div>
                    <div className="ev-reg-track">
                      <div className="ev-reg-fill" style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>

                  <div className="ev-card-footer">
                    <div className="ev-team-info">
                      <div className="ev-team-dot" />
                      {ev.type === "team"
                        ? `${ev.teamSize?.min || 1}–${ev.teamSize?.max || 4} members`
                        : "Individual event"}
                    </div>
                    <button
                      className="ev-btn"
                      onClick={() => router.push(`/events/${ev._id}`)}
                    >
                      <span>DETAILS →</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
