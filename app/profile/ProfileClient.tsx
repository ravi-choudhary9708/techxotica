"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_COLORS: Record<string, any> = {
    technical: { bg: "rgba(0,200,255,0.08)", border: "rgba(0,200,255,0.35)", text: "#00c8ff", glow: "rgba(0,200,255,0.4)" },
    cultural: { bg: "rgba(210,140,60,0.08)", border: "rgba(210,140,60,0.35)", text: "#d28c3c", glow: "rgba(210,140,60,0.4)" },
    gaming: { bg: "rgba(180,60,120,0.08)", border: "rgba(180,60,120,0.35)", text: "#c06080", glow: "rgba(180,60,120,0.4)" },
    other: { bg: "rgba(150,150,150,0.08)", border: "rgba(150,150,150,0.35)", text: "#cccccc", glow: "rgba(150,150,150,0.4)" }
};

const CATEGORY_ICONS: Record<string, string> = { technical: "⬡", cultural: "◈", gaming: "◉", other: "◬" };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pr-root {
    min-height: 100vh;
    background: #050508;
    color: #e8e0f0;
    font-family: 'Barlow Condensed', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Grid bg ── */
  .pr-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Ambient glows ── */
  .pr-glow-tl {
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: pr-glow-pulse 8s ease-in-out infinite;
  }
  .pr-glow-br {
    position: fixed;
    bottom: -200px; right: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,60,120,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: pr-glow-pulse 8s ease-in-out infinite 4s;
  }
  @keyframes pr-glow-pulse {
    0%,100% { opacity: 0.7; transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.1); }
  }

  /* ── Scanline ── */
  .pr-scanline {
    position: fixed;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(0,200,255,0.25), transparent);
    top: -2px;
    z-index: 100;
    pointer-events: none;
    animation: pr-scan 8s linear infinite 3s;
  }
  @keyframes pr-scan {
    0%   { top: -2px; opacity: 0; }
    3%   { opacity: 1; }
    97%  { opacity: 0.3; }
    100% { top: 100vh; opacity: 0; }
  }

  /* ── Layout ── */
  .pr-container {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 100px 24px 80px;
  }

  /* ── Header ── */
  .pr-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
    opacity: 0;
    transform: translateY(-16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .pr-header.pr-in { opacity: 1; transform: translateY(0); }
  .pr-header-line {
    height: 1px;
    flex: 1;
    background: linear-gradient(to right, rgba(0,200,255,0.5), transparent);
  }
  .pr-header-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 5px;
    color: #00c8ff;
    text-transform: uppercase;
  }
  .pr-header-line-r {
    height: 1px;
    width: 40px;
    background: rgba(0,200,255,0.3);
  }

  /* ── Main grid ── */
  .pr-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .pr-grid { grid-template-columns: 1fr; }
  }

  /* ── Card base ── */
  .pr-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s;
  }
  .pr-card.pr-in { opacity: 1; transform: translateY(0); }
  .pr-card:hover { border-color: rgba(0,200,255,0.2); }

  /* corner cuts */
  .pr-card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 22px 22px 0;
    border-color: transparent #050508 transparent transparent;
    z-index: 2;
  }
  .pr-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 22px; height: 22px;
    border-top: 1px solid rgba(0,200,255,0.35);
    border-right: 1px solid rgba(0,200,255,0.35);
    z-index: 3;
  }

  /* ── Identity card ── */
  .pr-identity { padding: 0; }

  .pr-id-top {
    padding: 28px 24px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
  }

  .pr-avatar {
    width: 64px; height: 64px;
    border-radius: 0;
    background: linear-gradient(135deg, rgba(0,200,255,0.15), rgba(180,60,120,0.15));
    border: 1px solid rgba(0,200,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rajdhani', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #00c8ff;
    margin-bottom: 16px;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    position: relative;
  }
  .pr-avatar::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,200,255,0.1), transparent);
    animation: pr-avatar-shimmer 3s ease-in-out infinite;
  }
  @keyframes pr-avatar-shimmer {
    0%,100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }

  .pr-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #f0e8ff;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .pr-branch-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    color: rgba(0,200,255,0.7);
    text-transform: uppercase;
  }
  .pr-branch-badge::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    background: #00c8ff;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    animation: pr-diamond-spin 4s linear infinite;
  }
  @keyframes pr-diamond-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── TechID Card — THE HERO ── */
  .pr-techid-block {
    margin: 20px 24px;
    padding: 18px 20px;
    background: rgba(0,200,255,0.04);
    border: 1px solid rgba(0,200,255,0.2);
    position: relative;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
  .pr-techid-block::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,200,255,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .pr-techid-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 4px;
    color: rgba(0,200,255,0.5);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .pr-techid-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    color: #00c8ff;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(0,200,255,0.5);
    animation: pr-techid-flicker 6s ease-in-out infinite;
  }
  @keyframes pr-techid-flicker {
    0%,90%,100% { opacity: 1; text-shadow: 0 0 20px rgba(0,200,255,0.5); }
    92%          { opacity: 0.7; text-shadow: 0 0 40px rgba(0,200,255,0.9); }
    94%          { opacity: 1; text-shadow: 0 0 20px rgba(0,200,255,0.5); }
    96%          { opacity: 0.8; }
  }
  .pr-techid-copy {
    position: absolute;
    top: 12px; right: 12px;
    background: transparent;
    border: 1px solid rgba(0,200,255,0.25);
    color: rgba(0,200,255,0.6);
    font-size: 10px;
    letter-spacing: 1px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Barlow Condensed', sans-serif;
  }
  .pr-techid-copy:hover {
    background: rgba(0,200,255,0.1);
    color: #00c8ff;
    border-color: rgba(0,200,255,0.5);
  }
  .pr-techid-copy.copied {
    color: #00ff88;
    border-color: rgba(0,255,136,0.4);
    background: rgba(0,255,136,0.06);
  }

  /* ── Info rows ── */
  .pr-info-rows { padding: 0 24px 24px; }
  .pr-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .pr-info-row:last-child { border-bottom: none; }
  .pr-info-key {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }
  .pr-info-val {
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #d8d0e8;
    letter-spacing: 0.5px;
  }

  /* ── Stats bar ── */
  .pr-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .pr-stat {
    padding: 16px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .pr-stat:last-child { border-right: none; }
  .pr-stat-num {
    font-family: 'Rajdhani', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #00c8ff;
    line-height: 1;
    margin-bottom: 4px;
  }
  .pr-stat-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }

  /* ── RIGHT: Events ── */
  .pr-events-col { display: flex; flex-direction: column; gap: 16px; min-height: 400px; }

  .pr-events-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease;
  }
  .pr-events-header.pr-in { opacity: 1; transform: translateX(0); }
  .pr-events-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #f0e8ff;
    text-transform: uppercase;
  }
  .pr-events-count {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: rgba(0,200,255,0.5);
    letter-spacing: 1px;
  }

  /* ── Event card ── */
  .pr-event-card {
    padding: 20px 22px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.3s, background 0.3s, transform 0.2s;
    opacity: 0;
    transform: translateX(30px);
  }
  .pr-event-card.pr-in { opacity: 1; transform: translateX(0); }
  .pr-event-card:hover {
    background: rgba(255,255,255,0.04);
    transform: translateX(-3px);
  }

  /* Left accent bar */
  .pr-event-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--accent, #00c8ff);
    box-shadow: 0 0 12px var(--glow, rgba(0,200,255,0.5));
  }

  /* Shimmer on hover */
  .pr-event-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.015) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .pr-event-card:hover::after { transform: translateX(100%); }

  .pr-event-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
  }
  .pr-event-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #f0e8ff;
    letter-spacing: 0.5px;
    line-height: 1.2;
  }
  .pr-event-badges {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  .pr-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 10px;
    border: 1px solid;
  }

  .pr-event-meta {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .pr-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.5px;
  }
  .pr-meta-icon {
    font-size: 10px;
    opacity: 0.6;
  }

  .pr-event-team {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
  }
  .pr-team-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .pr-role-pill {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 2px 8px;
    border: 1px solid;
    margin-left: auto;
  }

  /* ── Empty state ── */
  .pr-empty {
    padding: 48px 24px;
    text-align: center;
    border: 1px dashed rgba(255,255,255,0.08);
  }
  .pr-empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.3; }
  .pr-empty-text { font-size: 14px; color: rgba(255,255,255,0.3); letter-spacing: 1px; }

  /* ── Filter tabs ── */
  .pr-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.5s 0.3s ease, transform 0.5s 0.3s ease;
  }
  .pr-filters.pr-in { opacity: 1; transform: translateX(0); }
  .pr-filter-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }
  .pr-filter-btn:hover {
    border-color: rgba(0,200,255,0.3);
    color: rgba(0,200,255,0.8);
  }
  .pr-filter-btn.active {
    background: rgba(0,200,255,0.1);
    border-color: rgba(0,200,255,0.4);
    color: #00c8ff;
  }

  /* ── Logout btn ── */
  .pr-logout {
    margin-top: 24px;
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid rgba(255,80,80,0.25);
    color: rgba(255,80,80,0.6);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .pr-logout:hover {
    background: rgba(255,80,80,0.08);
    border-color: rgba(255,80,80,0.5);
    color: rgba(255,80,80,0.9);
  }
`;

export default function ProfileClient({ user }: { user: any }) {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
        if (!document.getElementById("pr-styles")) {
            const el = document.createElement("style");
            el.id = "pr-styles";
            el.textContent = styles;
            document.head.appendChild(el);
        }
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.techexoticaId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

    const filteredEvents = filter === "all"
        ? user.registeredEvents
        : user.registeredEvents.filter((e: any) => e.eventId.category === filter);

    const soloCount = user.registeredEvents.filter((e: any) => e.eventId.type === "solo").length;
    const teamCount = user.registeredEvents.filter((e: any) => e.eventId.type === "team").length;

    const cx = (...a: any[]) => a.filter(Boolean).join(" ");

    return (
        <div className="pr-root">
            <div className="pr-glow-tl" />
            <div className="pr-glow-br" />
            <div className="pr-scanline" />

            <div className="pr-container">
                {/* Header */}
                <div className={cx("pr-header", visible && "pr-in")}>
                    <div className="pr-header-line" />
                    <span className="pr-header-label">⬡ Player Profile</span>
                    <div className="pr-header-line-r" />
                </div>

                <div className="pr-grid">
                    {/* ── LEFT: Identity card ── */}
                    <div className={cx("pr-card pr-identity", visible && "pr-in")} style={{ transitionDelay: "0.1s" }}>
                        <div className="pr-id-top">
                            <div className="pr-avatar">{initials}</div>
                            <div className="pr-name">{user.name}</div>
                            <div className="pr-branch-badge">{user.branch} · Batch {user.batch}</div>
                        </div>

                        {/* TechID */}
                        <div className="pr-techid-block">
                            <div className="pr-techid-label">Techexotica ID</div>
                            <div className="pr-techid-value">{user.techexoticaId}</div>
                            <button
                                className={cx("pr-techid-copy", copied && "copied")}
                                onClick={handleCopy}
                            >
                                {copied ? "COPIED ✓" : "COPY"}
                            </button>
                        </div>

                        {/* Info rows */}
                        <div className="pr-info-rows">
                            {[
                                { key: "Reg No", val: user.regNo },
                                { key: "Phone", val: user.phone },
                                { key: "Branch", val: user.branch },
                                { key: "Batch", val: user.batch },
                            ].map(({ key, val }) => (
                                <div className="pr-info-row" key={key}>
                                    <span className="pr-info-key">{key}</span>
                                    <span className="pr-info-val">{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="pr-stats">
                            <div className="pr-stat">
                                <div className="pr-stat-num">{user.registeredEvents.length}</div>
                                <div className="pr-stat-label">Events</div>
                            </div>
                            <div className="pr-stat">
                                <div className="pr-stat-num">{soloCount}</div>
                                <div className="pr-stat-label">Solo</div>
                            </div>
                            <div className="pr-stat">
                                <div className="pr-stat-num">{teamCount}</div>
                                <div className="pr-stat-label">Team</div>
                            </div>
                        </div>

                        <div style={{ padding: "0 20px 20px" }}>
                            <button className="pr-logout" onClick={handleLogout}>⎋ Logout</button>
                        </div>
                    </div>

                    {/* ── RIGHT: Events ── */}
                    <div className="pr-events-col">
                        <div className={cx("pr-events-header", visible && "pr-in")}>
                            <span className="pr-events-title">Registered Events</span>
                            <span className="pr-events-count">{String(filteredEvents.length).padStart(2, "0")} / {String(user.registeredEvents.length).padStart(2, "0")}</span>
                        </div>

                        {/* Filters */}
                        <div className={cx("pr-filters", visible && "pr-in")}>
                            {["all", "technical", "cultural", "gaming", "other"].map((f) => (
                                <button
                                    key={f}
                                    className={cx("pr-filter-btn", filter === f && "active")}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === "all" ? "All" : `${CATEGORY_ICONS[f] || CATEGORY_ICONS.other} ${f}`}
                                </button>
                            ))}
                        </div>

                        {/* Event cards */}
                        {filteredEvents.length === 0 ? (
                            <div className="pr-empty">
                                <div className="pr-empty-icon">◈</div>
                                <div className="pr-empty-text">No events in this category</div>
                            </div>
                        ) : (
                            filteredEvents.map((reg: any, i: number) => {
                                const ev = reg.eventId;
                                if (!ev) return null;

                                const catCategory = (ev.category || "other").toLowerCase();
                                const cat = CATEGORY_COLORS[catCategory] || CATEGORY_COLORS.other;
                                const date = ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA";

                                return (
                                    <div
                                        key={reg._id}
                                        className={cx("pr-event-card", visible && "pr-in")}
                                        style={{
                                            "--accent": cat.text,
                                            "--glow": cat.glow,
                                            transitionDelay: `${0.25 + i * 0.08}s`,
                                        } as any}
                                    >
                                        <div className="pr-event-top">
                                            <div className="pr-event-name">{ev.name}</div>
                                            <div className="pr-event-badges">
                                                <span className="pr-badge" style={{ color: cat.text, borderColor: cat.border, background: cat.bg }}>
                                                    {CATEGORY_ICONS[catCategory] || "◬"} {catCategory.toUpperCase()}
                                                </span>
                                                <span className="pr-badge" style={{
                                                    color: ev.type === "team" ? "#d28c3c" : "rgba(255,255,255,0.4)",
                                                    borderColor: ev.type === "team" ? "rgba(210,140,60,0.3)" : "rgba(255,255,255,0.1)",
                                                    background: ev.type === "team" ? "rgba(210,140,60,0.06)" : "transparent",
                                                }}>
                                                    {ev.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pr-event-meta">
                                            <span className="pr-meta-item">
                                                <span className="pr-meta-icon">◷</span> {date}
                                            </span>
                                            <span className="pr-meta-item">
                                                <span className="pr-meta-icon">◈</span> {ev.venue || "TBA"}
                                            </span>
                                        </div>

                                        {ev.type === "team" && (
                                            <div className="pr-event-team">
                                                <span>Team</span>
                                                <span className="pr-team-name">{reg.teamName || "Nameless"}</span>
                                                <span className="pr-role-pill" style={{
                                                    color: reg.role === "leader" ? "#00c8ff" : "rgba(255,255,255,0.4)",
                                                    borderColor: reg.role === "leader" ? "rgba(0,200,255,0.3)" : "rgba(255,255,255,0.1)",
                                                }}>
                                                    {reg.role}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
