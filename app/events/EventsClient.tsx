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
    padding: 60px 20px 160px;
  }
  @media (min-width: 768px) {
    .ev-container { padding: 100px 24px 160px; }
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
    justify-content: flex-start;
    gap: 12px; flex-wrap: wrap;
    margin-bottom: 32px;
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease;
  }
  .ev-controls.ev-in { opacity: 1; transform: translateY(0); }

  .ev-filter-group {
    display: flex; gap: 6px; flex-wrap: wrap;
    max-width: 100%;
  }
  @media (max-width: 480px) {
    .ev-filter-group {
      overflow-x: auto;
      padding-bottom: 4px;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .ev-filter-group::-webkit-scrollbar { display: none; }
    .ev-divider-v { display: none; }
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
  .ev-card.in-cart {
    border-color: rgba(0,200,255,0.45) !important;
    background: rgba(0,200,255,0.04) !important;
    box-shadow: 0 0 24px rgba(0,200,255,0.12) !important;
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
    justify-content: space-between; gap: 8px;
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
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--c-border, rgba(0,200,255,0.3));
    color: var(--c-color, #00c8ff);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
    position: relative; overflow: hidden;
    white-space: nowrap;
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

  /* Cart button states */
  .ev-btn-cart-active {
    background: rgba(0,200,255,0.12) !important;
    border-color: #00c8ff !important;
    color: #00c8ff !important;
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

  /* ═══ CART BAR ═══ */
  .ev-cart-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    z-index: 200;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .ev-cart-bar.open { transform: translateY(0); }

  .ev-cart-bar-inner {
    background: rgba(5,5,10,0.96);
    border-top: 1px solid rgba(0,200,255,0.25);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 -20px 60px rgba(0,0,0,0.6), 0 -1px 0 rgba(0,200,255,0.15);
  }

  .ev-cart-top {
    max-width: 1200px; margin: 0 auto;
    padding: 12px 20px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .ev-cart-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 3px;
    color: #00c8ff; text-transform: uppercase;
    display: flex; align-items: center; gap: 8px;
  }

  .ev-cart-badge {
    background: #00c8ff; color: #050508;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; font-weight: 700;
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .ev-cart-items {
    flex: 1;
    display: flex; gap: 8px; flex-wrap: wrap;
    align-items: center;
    overflow-x: auto;
    padding: 2px 0;
    scrollbar-width: none;
  }
  .ev-cart-items::-webkit-scrollbar { display: none; }

  .ev-cart-chip {
    display: flex; align-items: center; gap: 6px;
    background: rgba(0,200,255,0.07);
    border: 1px solid rgba(0,200,255,0.2);
    padding: 4px 10px 4px 12px;
    font-size: 11px; letter-spacing: 1px;
    color: rgba(255,255,255,0.7);
    white-space: nowrap;
    clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
  }
  .ev-cart-chip-x {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.35); font-size: 14px; line-height: 1;
    padding: 0; transition: color 0.2s;
  }
  .ev-cart-chip-x:hover { color: #ff4040; }

  .ev-cart-clear {
    background: none; border: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 2px;
    color: rgba(255,255,255,0.2);
    cursor: pointer; text-transform: uppercase;
    transition: color 0.2s; padding: 0;
    white-space: nowrap;
  }
  .ev-cart-clear:hover { color: #ff4040; }

  .ev-cart-cta {
    max-width: 1200px; margin: 0 auto;
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: flex-end;
    gap: 12px;
  }

  .ev-cart-reg-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase;
    padding: 12px 32px;
    background: linear-gradient(135deg, #00c8ff, #0066ff);
    color: #050508;
    border: none; cursor: pointer;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .ev-cart-reg-btn:hover {
    box-shadow: 0 0 30px rgba(0,200,255,0.5);
    transform: translateY(-1px);
  }
  .ev-cart-count-txt {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 1px;
  }

  /* ═══ MODAL OVERLAY ═══ */
  .ev-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 300;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .ev-modal-overlay.open {
    opacity: 1; pointer-events: all;
  }

  .ev-modal {
    background: #07070e;
    border: 1px solid rgba(0,200,255,0.2);
    width: 100%; max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,200,255,0.08);
    transform: translateY(20px) scale(0.97);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    scrollbar-width: thin;
    scrollbar-color: rgba(0,200,255,0.2) transparent;
  }
  .ev-modal-overlay.open .ev-modal {
    transform: translateY(0) scale(1);
  }

  .ev-modal-header {
    padding: 22px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #07070e; z-index: 1;
  }

  .ev-modal-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 20px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: #f0e8ff;
  }
  .ev-modal-close {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.3); font-size: 22px; line-height: 1;
    padding: 0; transition: color 0.2s;
  }
  .ev-modal-close:hover { color: #fff; }

  .ev-modal-body { padding: 20px 24px; }

  /* Each event entry in modal */
  .ev-modal-event {
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    position: relative;
    overflow: hidden;
  }
  .ev-modal-event::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: var(--c-color, #00c8ff);
    box-shadow: 0 0 8px var(--c-color, #00c8ff);
  }
  .ev-modal-event-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700;
    color: #f0e8ff; margin-bottom: 4px; letter-spacing: 0.5px;
  }
  .ev-modal-event-type {
    font-size: 10px; letter-spacing: 2px;
    color: var(--c-color, #00c8ff); text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* Modal fields */
  .ev-modal-field { margin-top: 10px; }
  .ev-modal-label {
    display: block; font-size: 9px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 6px;
  }
  .ev-modal-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #f0e8ff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ev-modal-input:focus {
    border-color: rgba(0,200,255,0.4);
    box-shadow: 0 0 12px rgba(0,200,255,0.08);
  }
  .ev-modal-input::placeholder { color: rgba(255,255,255,0.18); }
  .ev-modal-hint {
    font-size: 10px; color: rgba(255,255,255,0.2);
    margin-top: 4px; letter-spacing: 0.5px;
  }

  /* Result per event */
  .ev-result-ok  { color: #00ff88; font-size: 11px; margin-top: 6px; letter-spacing: 1px; }
  .ev-result-err { color: #ff4040; font-size: 11px; margin-top: 6px; letter-spacing: 1px; }
  .ev-result-skip { color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 6px; letter-spacing: 1px; }

  .ev-modal-footer {
    padding: 16px 24px 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; gap: 10px; flex-direction: column;
  }

  .ev-modal-submit {
    width: 100%;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase;
    padding: 14px;
    background: linear-gradient(135deg, #0066cc, #00c8ff);
    color: #fff;
    border: none; cursor: pointer;
    clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
    transition: all 0.2s;
  }
  .ev-modal-submit:hover {
    box-shadow: 0 0 30px rgba(0,200,255,0.4);
    transform: translateY(-1px);
  }
  .ev-modal-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ev-modal-cancel {
    background: none; border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.35);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
    padding: 10px; cursor: pointer;
    transition: all 0.2s; width: 100%;
  }
  .ev-modal-cancel:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.6); }
`;

interface TeamInput {
  teamName: string;
  memberTechIds: string;
}

export default function EventsClient({ events }: { events: any[] }) {
  const [visible, setVisible] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filledBars, setFilledBars] = useState(false);
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [teamInputs, setTeamInputs] = useState<Record<string, TeamInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Record<string, { ok: boolean; msg: string }>>({});
  const [done, setDone] = useState(false);
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
    if (typeFilter === "solo") {
      if ((ev.teamSize?.min || 1) !== 1) return false;
    } else if (typeFilter === "team") {
      if ((ev.teamSize?.max || 1) <= 1) return false;
    }
    return true;
  });

  const cx = (...a: any[]) => a.filter(Boolean).join(" ");

  const totalRegs = events.reduce((s, e) => s + (e.participantsCount || 0), 0);
  const maxReg = Math.max(1, ...events.map(e => e.participantsCount || 0));

  // Cart helpers
  const toggleCart = (id: string) => {
    setCart(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const cartEvents = events.filter(ev => cart.has(ev._id));

  // Open modal — init team inputs for team events
  const openModal = () => {
    const init: Record<string, TeamInput> = {};
    cartEvents.forEach(ev => {
      if (ev.type === "team") {
        init[ev._id] = teamInputs[ev._id] || { teamName: "", memberTechIds: "" };
      }
    });
    setTeamInputs(init);
    setResults({});
    setDone(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setResults({});
    setDone(false);
  };

  const handleTeamInput = (evId: string, field: keyof TeamInput, val: string) => {
    setTeamInputs(prev => ({ ...prev, [evId]: { ...prev[evId], [field]: val } }));
  };

  const handleRegisterAll = async () => {
    setSubmitting(true);
    const newResults: Record<string, { ok: boolean; msg: string }> = {};

    for (const ev of cartEvents) {
      try {
        let body: any = { eventId: ev._id };
        if (ev.type === "team") {
          const inp = teamInputs[ev._id] || { teamName: "", memberTechIds: "" };
          const memberArr = inp.memberTechIds
            .split(/[\n,]+/)
            .map((s: string) => s.trim())
            .filter(Boolean);
          body = { ...body, teamName: inp.teamName.trim(), memberTechIds: memberArr };
        }

        const res = await fetch("/api/events/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (res.ok) {
          newResults[ev._id] = { ok: true, msg: "Registered successfully ✓" };
        } else if (res.status === 401) {
          newResults[ev._id] = { ok: false, msg: "Not logged in — please sign in first" };
        } else {
          newResults[ev._id] = { ok: false, msg: data.message || "Registration failed" };
        }
      } catch {
        newResults[ev._id] = { ok: false, msg: "Network error — try again" };
      }
    }

    setResults(newResults);
    setDone(true);
    setSubmitting(false);

    // Remove successfully registered from cart
    const successIds = Object.entries(newResults)
      .filter(([, r]) => r.ok)
      .map(([id]) => id);
    if (successIds.length) {
      setCart(prev => {
        const next = new Set(prev);
        successIds.forEach(id => next.delete(id));
        return next;
      });
    }
  };

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
              const inCart = cart.has(ev._id);

              return (
                <div
                  key={ev._id}
                  className={cx("ev-card", visible && "ev-in", inCart && "in-cart")}
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

                  {/* In-cart indicator */}
                  {inCart && (
                    <div style={{
                      position: "absolute", top: 10, left: 10, zIndex: 5,
                      background: "rgba(0,200,255,0.15)",
                      border: "1px solid rgba(0,200,255,0.4)",
                      color: "#00c8ff",
                      fontSize: 9, letterSpacing: 2, fontWeight: 700,
                      padding: "2px 8px", textTransform: "uppercase",
                    }}>
                      ✓ In Cart
                    </div>
                  )}

                  <div className="ev-card-body" style={{ paddingTop: inCart ? 32 : 22 }}>
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
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* Add / remove cart */}
                      <button
                        className={cx("ev-btn", inCart && "ev-btn-cart-active")}
                        onClick={() => toggleCart(ev._id)}
                        title={inCart ? "Remove from cart" : "Add to cart"}
                      >
                        <span>{inCart ? "✓ Added" : "+ Cart"}</span>
                      </button>
                      {/* Details */}
                      <button
                        className="ev-btn"
                        onClick={() => router.push(`/events/${ev._id}`)}
                        style={{ "--c-color": c.color, "--c-border": c.border, "--c-bg": c.bg, "--c-glow": c.glow } as any}
                      >
                        <span>Details →</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ═══ STICKY CART BAR ═══ */}
      <div className={cx("ev-cart-bar", cart.size > 0 && "open")}>
        <div className="ev-cart-bar-inner">
          <div className="ev-cart-top">
            <span className="ev-cart-label">
              <span>⬡ Cart</span>
              <span className="ev-cart-badge">{cart.size}</span>
            </span>
            <div className="ev-cart-items">
              {cartEvents.map(ev => (
                <div key={ev._id} className="ev-cart-chip">
                  {ev.title || ev.name}
                  <button className="ev-cart-chip-x" onClick={() => removeFromCart(ev._id)} title="Remove">×</button>
                </div>
              ))}
            </div>
            <button className="ev-cart-clear" onClick={() => setCart(new Set())}>Clear all</button>
          </div>
          <div className="ev-cart-cta">
            <span className="ev-cart-count-txt">{cart.size} event{cart.size !== 1 ? "s" : ""} selected</span>
            <button className="ev-cart-reg-btn" onClick={openModal}>
              Register All →
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CHECKOUT MODAL ═══ */}
      <div className={cx("ev-modal-overlay", modalOpen && "open")} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="ev-modal">
          <div className="ev-modal-header">
            <span className="ev-modal-title">Register for {cartEvents.length} Event{cartEvents.length !== 1 ? "s" : ""}</span>
            <button className="ev-modal-close" onClick={closeModal}>×</button>
          </div>

          <div className="ev-modal-body">
            {done && (
              <div style={{
                padding: "12px 16px", marginBottom: 16,
                background: "rgba(0,200,255,0.05)",
                border: "1px solid rgba(0,200,255,0.2)",
                fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,0.5)"
              }}>
                Registration complete. Check results below.
              </div>
            )}

            {cartEvents.map(ev => {
              const catString = (ev.category || "other").toLowerCase();
              const c = CAT[catString] || CAT.other;
              const result = results[ev._id];

              return (
                <div
                  key={ev._id}
                  className="ev-modal-event"
                  style={{ "--c-color": c.color } as any}
                >
                  <div className="ev-modal-event-name">{ev.title || ev.name}</div>
                  <div className="ev-modal-event-type">
                    {catString} · {ev.type === "solo" ? "Solo event — no extra info needed" : `Team event · ${ev.teamSize?.min || 1}–${ev.teamSize?.max || 4} members`}
                  </div>

                  {ev.type === "team" && !done && (
                    <>
                      <div className="ev-modal-field">
                        <label className="ev-modal-label">Team Name</label>
                        <input
                          className="ev-modal-input"
                          placeholder="e.g. Phantom Squad"
                          value={teamInputs[ev._id]?.teamName || ""}
                          onChange={e => handleTeamInput(ev._id, "teamName", e.target.value)}
                        />
                      </div>
                      <div className="ev-modal-field">
                        <label className="ev-modal-label">Member Techexotica IDs</label>
                        <textarea
                          className="ev-modal-input"
                          rows={3}
                          placeholder={"TX-98765-2024\nTX-11223-2023"}
                          style={{ resize: "vertical", lineHeight: 1.6 }}
                          value={teamInputs[ev._id]?.memberTechIds || ""}
                          onChange={e => handleTeamInput(ev._id, "memberTechIds", e.target.value)}
                        />
                        <div className="ev-modal-hint">Enter each member's TX ID — one per line or comma-separated (excluding yourself)</div>
                      </div>
                    </>
                  )}

                  {/* Result indicator */}
                  {result && (
                    <div className={result.ok ? "ev-result-ok" : "ev-result-err"}>
                      {result.msg}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ev-modal-footer">
            {!done ? (
              <>
                <button
                  className="ev-modal-submit"
                  onClick={handleRegisterAll}
                  disabled={submitting}
                >
                  {submitting ? "Registering..." : `Confirm & Register ${cartEvents.length} Event${cartEvents.length !== 1 ? "s" : ""}`}
                </button>
                <button className="ev-modal-cancel" onClick={closeModal} disabled={submitting}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="ev-modal-submit" onClick={closeModal}>
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
