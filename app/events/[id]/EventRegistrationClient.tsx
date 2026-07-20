"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import AttendeePass from "./AttendeePass";

const getDefaultEventImage = (name: string) => {
    const lowerName = (name || "").toLowerCase();
    if (lowerName.includes("bgmi")) return "/bgmi.png";
    if (lowerName.includes("free fire") || lowerName.includes("freefire")) return "/freefire.png";
    return "/event.png";
};

const CAT: any = {
    technical: { color: "#00c8ff", border: "rgba(0,200,255,0.35)", bg: "rgba(0,200,255,0.07)", glow: "rgba(0,200,255,0.45)", icon: "⬡" },
    cultural: { color: "#d28c3c", border: "rgba(210,140,60,0.35)", bg: "rgba(210,140,60,0.07)", glow: "rgba(210,140,60,0.45)", icon: "◈" },
    gaming: { color: "#c06080", border: "rgba(180,60,120,0.35)", bg: "rgba(180,60,120,0.07)", glow: "rgba(180,60,120,0.45)", icon: "◉" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  .ed-root {
    min-height:100vh; background:#04030a;
    color:#e8e0f0; font-family:'Barlow Condensed',sans-serif;
    position:relative; overflow-x:hidden;
  }

  /* ── Grid bg ── */
  .ed-root::before {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(0,200,255,0.022) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,200,255,0.022) 1px,transparent 1px);
    background-size:55px 55px;
    pointer-events:none; z-index:0;
  }

  /* Glows */
  .ed-glow-tl {
    position:fixed; top:-200px; left:-100px;
    width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,rgba(0,200,255,0.055) 0%,transparent 70%);
    pointer-events:none; z-index:0;
    animation:ed-gp 10s ease-in-out infinite;
  }
  .ed-glow-br {
    position:fixed; bottom:-200px; right:-100px;
    width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,rgba(0,200,255,0.04) 0%,transparent 70%);
    pointer-events:none; z-index:0;
    animation:ed-gp 10s ease-in-out infinite 5s;
  }
  @keyframes ed-gp{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.1);opacity:1}}

  /* Scanline */
  .ed-scan {
    position:fixed;left:0;right:0;height:2px;top:-2px;
    background:linear-gradient(to right,transparent,rgba(0,200,255,0.22),transparent);
    z-index:100; pointer-events:none;
    animation:ed-scanline 8s linear infinite 1s;
  }
  @keyframes ed-scanline{0%{top:-2px;opacity:0}3%{opacity:1}97%{opacity:.2}100%{top:100vh;opacity:0}}

  /* Particles */
  .ed-particle {
    position:fixed; border-radius:50%;
    pointer-events:none; z-index:1;
    animation:ed-drift linear infinite;
  }
  @keyframes ed-drift{
    0%{transform:translateY(0) translateX(0) scale(.8);opacity:0}
    12%{opacity:1}88%{opacity:.5}
    100%{transform:translateY(-100px) translateX(18px) scale(1.2);opacity:0}
  }

  /* ═══════════════════════════════════════
     HERO — full-width split layout
  ═══════════════════════════════════════ */
  .ed-hero {
    position:relative; width:100%;
    min-height:100vh; display:flex;
    overflow:hidden;
  }

  /* Left: neon anime image */
  .ed-hero-img-col {
    position:relative; width:46%; flex-shrink:0;
    overflow:hidden;
  }
  .ed-hero-img {
    position:absolute; inset:0;
    width:100%; height:100%;
    object-fit:cover; object-position:center top;
    opacity:0; transform:scale(1.06);
    transition:opacity 1s ease,transform 1.2s ease;
    filter:brightness(.85) saturate(1.1);
  }
  .ed-hero-img.ed-in {
    opacity:1; transform:scale(1);
    animation:ed-img-float 8s ease-in-out infinite 1.5s;
  }
  @keyframes ed-img-float{
    0%,100%{transform:scale(1) translateY(0);filter:brightness(.85) saturate(1.1) drop-shadow(0 0 30px rgba(0,200,255,.1));}
    50%{transform:scale(1.02) translateY(-8px);filter:brightness(.9) saturate(1.2) drop-shadow(0 0 50px rgba(0,200,255,.25));}
  }

  /* Neon scan lines over image */
  .ed-img-lines {
    position:absolute; inset:0; z-index:2; pointer-events:none;
    background:repeating-linear-gradient(
      transparent 0px, transparent 3px,
      rgba(0,200,255,0.018) 4px, transparent 5px
    );
  }

  /* Edge fade into content */
  .ed-hero-img-fade {
    position:absolute; inset:0; z-index:3;
    background:linear-gradient(
      to right,
      transparent 0%,transparent 50%,
      rgba(4,3,10,.5) 75%,#04030a 100%
    );
  }
  .ed-hero-img-fade-b {
    position:absolute; bottom:0;left:0;right:0; height:30%; z-index:3;
    background:linear-gradient(to top,rgba(4,3,10,.85),transparent);
  }

  /* Floating HUD elements on image */
  .ed-hud-circle {
    position:absolute; top:12%; right:14%; z-index:4;
    width:90px; height:90px;
    border:1px solid rgba(0,200,255,.35);
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .8s 1s ease;
    animation:ed-hud-spin 12s linear infinite;
  }
  .ed-hud-circle.ed-in{opacity:1;}
  @keyframes ed-hud-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .ed-hud-circle-inner {
    width:70px; height:70px;
    border:1px solid rgba(0,200,255,.2);
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    animation:ed-hud-spin 8s linear infinite reverse;
    font-family:'Share Tech Mono',monospace;
    font-size:10px; letter-spacing:1px; color:rgba(0,200,255,.6);
  }

  /* Right: event info */
  .ed-hero-info-col {
    flex:1; position:relative; z-index:5;
    display:flex; align-items:center;
    padding:60px 5% 60px 3%;
  }

  .ed-hero-content {
    width:100%;
    opacity:0; transform:translateX(30px);
    transition:opacity .8s .3s ease,transform .8s .3s ease;
  }
  .ed-hero-content.ed-in{opacity:1;transform:translateX(0);}

  /* Eyebrow */
  .ed-eyebrow {
    display:flex; align-items:center; gap:10px;
    font-size:10px; font-weight:700; letter-spacing:5px;
    color:#00c8ff; text-transform:uppercase; margin-bottom:16px;
  }
  .ed-eyebrow::before{
    content:''; display:inline-block;
    width:28px;height:1px;background:#00c8ff;
    box-shadow:0 0 6px rgba(0,200,255,.6);
  }

  /* Big title */
  .ed-event-title {
    font-family:'Rajdhani',sans-serif;
    font-size:clamp(42px,5.5vw,80px);
    font-weight:700; line-height:.95;
    letter-spacing:2px; text-transform:uppercase;
    color:#fff;
    margin-bottom:8px;
    animation:ed-title-shimmer 7s ease-in-out infinite 2s;
  }
  @keyframes ed-title-shimmer{
    0%,88%,100%{text-shadow:0 0 40px rgba(0,200,255,.15);}
    91%{text-shadow:0 0 60px rgba(0,200,255,.5),0 0 100px rgba(0,200,255,.2);}
  }

  /* Tagline */
  .ed-tagline {
    font-size:15px; letter-spacing:3px;
    color:rgba(255,255,255,.35); text-transform:uppercase;
    margin-bottom:24px;
  }

  /* Meta row */
  .ed-meta-strip {
    display:flex; flex-wrap:wrap; gap:20px;
    margin-bottom:28px;
  }
  .ed-meta-chip {
    display:flex; align-items:center; gap:8px;
    font-size:13px; color:rgba(255,255,255,.5);
    letter-spacing:.5px;
  }
  .ed-meta-chip-icon{font-size:12px;color:#00c8ff;opacity:.7;}
  .ed-meta-chip strong{color:#d0c8e0;font-weight:600;}

  /* Badge row */
  .ed-badge-row{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap;}
  .ed-badge {
    font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
    padding:5px 14px;border:1px solid;
    clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
  }

  /* CTA buttons */
  .ed-cta-row{display:flex;gap:12px;flex-wrap:wrap;}
  .ed-btn-primary {
    padding:14px 36px;
    font-family:'Rajdhani',sans-serif;
    font-size:16px;font-weight:700;letter-spacing:4px;text-transform:uppercase;
    background:linear-gradient(135deg,#0088bb 0%,#00c8ff 50%,#0088bb 100%);
    background-size:200% 100%;
    color:#04030a; border:none; cursor:pointer;
    position:relative; overflow:hidden;
    transition:background-position .4s,box-shadow .3s,transform .2s;
    clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
  }
  .ed-btn-primary::before{
    content:'';position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);
    transform:translateX(-100%); transition:transform .5s ease;
  }
  .ed-btn-primary:hover{background-position:100% 0;box-shadow:0 0 36px rgba(0,200,255,.55);transform:translateY(-1px);}
  .ed-btn-primary:hover::before{transform:translateX(100%);}
  .ed-btn-primary:disabled{opacity:.5;pointer-events:none;}

  .ed-btn-secondary {
    padding:14px 28px;
    font-family:'Barlow Condensed',sans-serif;
    font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
    background:transparent;color:rgba(0,200,255,.7);
    border:1px solid rgba(0,200,255,.3); cursor:pointer;
    transition:all .2s;
    clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
  }
  .ed-btn-secondary:hover{background:rgba(0,200,255,.08);border-color:#00c8ff;color:#00c8ff;box-shadow:0 0 16px rgba(0,200,255,.2);}
  .ed-btn-secondary:disabled{opacity:.5;pointer-events:none;}

  /* ═══════════════════════════════════════
     BODY SECTIONS
  ═══════════════════════════════════════ */
  .ed-body {
    position:relative; z-index:5;
    max-width:1140px; margin:0 auto;
    padding:64px 24px 100px;
    display:grid; grid-template-columns:1fr 340px; gap:28px;
    align-items:start;
  }
  @media(max-width:900px){.ed-body{grid-template-columns:1fr;}}

  /* Section heading */
  .ed-sec-title {
    font-family:'Rajdhani',sans-serif;
    font-size:14px;font-weight:700;letter-spacing:4px;
    color:rgba(255,255,255,.4);text-transform:uppercase;
    margin-bottom:20px;
    display:flex;align-items:center;gap:12px;
  }
  .ed-sec-title::after{
    content:'';flex:1;height:1px;
    background:linear-gradient(to right,rgba(255,255,255,.07),transparent);
  }

  /* Card base */
  .ed-card {
    background:rgba(255,255,255,.025);
    border:1px solid rgba(255,255,255,.07);
    position:relative; overflow:hidden;
    margin-bottom:20px;
    opacity:0; transform:translateY(24px);
    transition:opacity .6s ease,transform .6s ease,border-color .3s;
  }
  .ed-card.ed-in{opacity:1;transform:translateY(0);}
  .ed-card:hover{border-color:rgba(0,200,255,.15);}
  /* corner cut */
  .ed-card::before{
    content:'';position:absolute;top:0;right:0;
    border-style:solid;border-width:0 20px 20px 0;
    border-color:transparent #04030a transparent transparent;z-index:3;
  }
  .ed-card-top-bar{height:2px;background:linear-gradient(to right,rgba(0,200,255,.5),transparent);}
  .ed-card-pad{padding:22px 24px;}

  /* ── About ── */
  .ed-desc{
    font-size:15px;font-weight:300;
    color:rgba(255,255,255,.5);
    line-height:1.75;letter-spacing:.3px;
  }

  /* ── Rules ── */
  .ed-rules-list{display:flex;flex-direction:column;gap:10px;}
  .ed-rule-item{
    display:flex;align-items:flex-start;gap:12px;
    font-size:13px;font-weight:300;
    color:rgba(255,255,255,.45);line-height:1.5;
    padding:10px 14px;
    background:rgba(255,255,255,.02);
    border-left:2px solid rgba(0,200,255,.2);
    transition:border-color .2s,background .2s;
    opacity:0;transform:translateX(-16px);
    transition:opacity .4s ease,transform .4s ease,border-color .2s,background .2s;
  }
  .ed-rule-item.ed-in{opacity:1;transform:translateX(0);}
  .ed-rule-item:hover{border-color:#00c8ff;background:rgba(0,200,255,.03);}
  .ed-rule-num{
    font-family:'Share Tech Mono',monospace;
    font-size:11px;color:#00c8ff;
    letter-spacing:1px;flex-shrink:0;margin-top:1px;
  }

  /* ── Team Registration Form ── */
  .ed-reg-form{display:flex;flex-direction:column;gap:16px;}
  .ed-input-group{display:flex;flex-direction:column;gap:6px;}
  .ed-label{font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(0,200,255,.6);text-transform:uppercase;}
  .ed-input{
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.1);
    padding:12px 16px; color:#fff; font-family:'Barlow Condensed',sans-serif; font-size:15px;
    clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
    outline:none; transition:border-color .2s;
  }
  .ed-input:focus{border-color:#00c8ff;}

  .ed-member-list{display:flex;flex-direction:column;gap:8px;}
  .ed-member-item{
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 14px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
    clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
  }
  .ed-member-id{font-family:'Share Tech Mono',monospace;font-size:12px;color:#00c8ff;}
  .ed-member-name{font-size:14px;color:#fff;}

  /* ── RIGHT sidebar ── */
  .ed-sidebar{display:flex;flex-direction:column;gap:20px;}

  /* Quick facts in sidebar */
  .ed-quick-facts{display:flex;flex-direction:column;}
  .ed-quick-row{
    display:flex;align-items:center;justify-content:space-between;
    padding:11px 0;border-bottom:1px solid rgba(255,255,255,.04);
  }
  .ed-quick-row:last-child{border-bottom:none;}
  .ed-quick-key{
    font-size:10px;font-weight:700;letter-spacing:2px;
    color:rgba(255,255,255,.28);text-transform:uppercase;
    display:flex;align-items:center;gap:7px;
  }
  .ed-quick-key::before{
    content:'';width:4px;height:4px;border-radius:50%;
    background:#00c8ff;opacity:.5;
  }
  .ed-quick-val{
    font-family:'Rajdhani',sans-serif;
    font-size:15px;font-weight:600;color:#d0c8e0;letter-spacing:.5px;
  }

  /* Nav bar */
  .ed-nav {
    position:fixed; top:0;left:0;right:0; z-index:200;
    padding:16px 32px;
    display:flex;align-items:center;gap:16px;
    background:linear-gradient(to bottom,rgba(4,3,10,.95),transparent);
    opacity:0;transform:translateY(-12px);
    transition:opacity .5s ease,transform .5s ease;
  }
  .ed-nav.ed-in{opacity:1;transform:translateY(0);}
  .ed-back-btn {
    font-family:'Barlow Condensed',sans-serif;
    font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
    padding:7px 18px; background:transparent;
    border:1px solid rgba(255,255,255,.12);
    color:rgba(255,255,255,.4); cursor:pointer;
    transition:all .2s;
    clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
    display:flex;align-items:center;gap:6px;
  }
  .ed-back-btn:hover{border-color:rgba(0,200,255,.35);color:#00c8ff;}
  .ed-nav-title{
    font-family:'Rajdhani',sans-serif;
    font-size:16px;font-weight:700;letter-spacing:2px;
    color:rgba(255,255,255,.4);text-transform:uppercase;
  }
  .ed-nav-line{flex:1;height:1px;background:linear-gradient(to right,rgba(255,255,255,.06),transparent);}
  .ed-nav-id{
    font-family:'Share Tech Mono',monospace;
    font-size:11px;color:rgba(0,200,255,.4);letter-spacing:1px;
  }
`;

const PARTICLES = [
    { id: 0, left: '20%', bottom: '15%', size: '3.5px', color: 'rgba(0,200,255,.55)', dur: '8.2s', del: '1.4s' },
    { id: 1, left: '85%', bottom: '40%', size: '2.1px', color: 'rgba(0,255,160,.4)', dur: '5.6s', del: '3.2s' },
    { id: 2, left: '45%', bottom: '75%', size: '4.8px', color: 'rgba(0,200,255,.3)', dur: '12.1s', del: '0.5s' },
    { id: 3, left: '10%', bottom: '60%', size: '2.9px', color: 'rgba(0,200,255,.55)', dur: '9.4s', del: '2.8s' },
    { id: 4, left: '75%', bottom: '25%', size: '4.2px', color: 'rgba(0,255,160,.4)', dur: '6.8s', del: '4.1s' },
    { id: 5, left: '35%', bottom: '10%', size: '3.1px', color: 'rgba(0,200,255,.3)', dur: '10.3s', del: '1.9s' },
    { id: 6, left: '60%', bottom: '55%', size: '2.5px', color: 'rgba(0,200,255,.55)', dur: '7.5s', del: '5.6s' },
    { id: 7, left: '90%', bottom: '80%', size: '4.5px', color: 'rgba(0,255,160,.4)', dur: '11.8s', del: '0.9s' },
    { id: 8, left: '15%', bottom: '35%', size: '3.8px', color: 'rgba(0,200,255,.3)', dur: '8.9s', del: '3.7s' },
    { id: 9, left: '50%', bottom: '90%', size: '2.4px', color: 'rgba(0,200,255,.55)', dur: '6.2s', del: '2.2s' },
    { id: 10, left: '80%', bottom: '10%', size: '4.9px', color: 'rgba(0,255,160,.4)', dur: '12.7s', del: '4.8s' },
    { id: 11, left: '25%', bottom: '65%', size: '3.3px', color: 'rgba(0,200,255,.3)', dur: '9.8s', del: '1.1s' },
    { id: 12, left: '70%', bottom: '45%', size: '2.7px', color: 'rgba(0,200,255,.55)', dur: '7.1s', del: '5.3s' },
    { id: 13, left: '5%', bottom: '85%', size: '4.1px', color: 'rgba(0,255,160,.4)', dur: '11.2s', del: '2.5s' }
];

export default function EventRegistrationClient({ event, user, isRegistered, registration }: any) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [bodyIn, setBodyIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editMembers, setEditMembers] = useState<any[]>(registration?.members || []);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [showPassModal, setShowPassModal] = useState(false);

    const isLeader = registration?.leader?.techexoticaId === user.techexoticaId;

    const ev = event;
    const allowedRoles = Array.isArray(ev.allowedRoles) && ev.allowedRoles.length > 0 ? ev.allowedRoles : ["Participant", "Attendee"];
    const [selectedRole, setSelectedRole] = useState(allowedRoles[0]);
    const c = CAT[ev.category] || CAT.technical;

    // ── Player Search state ──
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [viewedPlayer, setViewedPlayer] = useState<any | null>(null);
    const [inviteSending, setInviteSending] = useState<string | null>(null);
    const [inviteMsg, setInviteMsg] = useState<{ txId: string; ok: boolean; msg: string } | null>(null);

    // ── Team Logo state ──
    const [teamLogo, setTeamLogo] = useState(registration?.teamLogo || "");
    const [logoUploading, setLogoUploading] = useState(false);

    const [dateStr, setDateStr] = useState("");
    useEffect(() => {
        setDateStr(ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "TBA");
        if (!document.getElementById("ed-styles")) {
            const el = document.createElement("style");
            el.id = "ed-styles"; el.textContent = styles;
            document.head.appendChild(el);
        }
        setTimeout(() => setVisible(true), 80);
        setTimeout(() => setBodyIn(true), 400);
    }, [ev.date]);

    // Staggered reveal using IntersectionObserver
    useEffect(() => {
        if (!bodyIn) return;
        const targets = document.querySelectorAll(".ed-card,.ed-round,.ed-rule-item,.ed-prize-tier,.ed-coord-item");
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("ed-in"); });
        }, { threshold: .12 });
        targets.forEach(t => obs.observe(t));
        return () => obs.disconnect();
    }, [bodyIn]);

    const handleAddMember = async (playerObj?: any) => {
        // Fallback for exact match if needed, but primary use is with playerObj
        const targetId = playerObj ? playerObj.techexoticaId : searchQuery.toUpperCase();
        if (!targetId) return;
        setError("");

        if (targetId === user.techexoticaId) {
            setError("You are already the team leader.");
            return;
        }

        if (members.some(m => m.techexoticaId === targetId)) {
            setError("Member already added.");
            return;
        }

        if (members.length + 1 >= ev.maxTeamSize) {
            setError(`Maximum team size is ${ev.maxTeamSize}.`);
            return;
        }

        if (playerObj) {
            setMembers([...members, playerObj]);
            setSearchQuery("");
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const res = await fetch(`/api/user/find-by-txid?txId=${targetId}`);
            const data = await res.json();

            if (data.success) {
                setMembers([...members, data.user]);
                setSearchQuery("");
                setSearchResults([]);
            } else {
                setError(data.message || "User not found.");
            }
        } catch (err) {
            setError("Failed to lookup user.");
        } finally {
            setSearchLoading(false);
        }
    };

    const removeMember = (txId: string) => {
        setMembers(members.filter(m => m.techexoticaId !== txId));
    };

    // ── Edit-mode handlers ──
    const handleAddMemberEdit = async (playerObj?: any) => {
        const targetId = playerObj ? playerObj.techexoticaId : searchQuery.toUpperCase();
        if (!targetId) return;
        setEditError("");

        if (targetId === user.techexoticaId) { setEditError("You are the leader."); return; }
        if (editMembers.some(m => m.techexoticaId === targetId)) { setEditError("Already in team."); return; }
        if (editMembers.length + 1 >= ev.maxTeamSize) { setEditError(`Max team size is ${ev.maxTeamSize}.`); return; }

        if (playerObj) {
            setEditMembers([...editMembers, playerObj]);
            setSearchQuery("");
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const res = await fetch(`/api/user/find-by-txid?txId=${targetId}`);
            const data = await res.json();
            if (data.success) { 
                setEditMembers([...editMembers, data.user]); 
                setSearchQuery("");
                setSearchResults([]);
            }
            else setEditError(data.message || "User not found.");
        } catch { setEditError("Lookup failed."); }
        finally { setSearchLoading(false); }
    };

    const handleRemoveMemberEdit = (txId: string) => {
        setEditMembers(editMembers.filter(m => m.techexoticaId !== txId));
    };

    const handleSaveTeam = async () => {
        setEditError(""); setEditSuccess(""); setEditSaving(true);
        try {
            const res = await fetch("/api/events/register", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationId: registration._id,
                    addMemberTechIds: editMembers
                        .filter(m => !registration.members.some((o: any) => o.techexoticaId === m.techexoticaId))
                        .map((m: any) => m.techexoticaId),
                    removeMemberTechIds: registration.members
                        .filter((o: any) => !editMembers.some(m => m.techexoticaId === o.techexoticaId))
                        .map((o: any) => o.techexoticaId),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setEditSuccess("Team updated successfully!");
                setEditMode(false);
                router.refresh();
            } else {
                setEditError(data.message || "Failed to update team.");
            }
        } catch { setEditError("Network error."); }
        finally { setEditSaving(false); }
    };

    // ── Player search handler ──
    const handleSearch = async (q: string) => {
        setSearchQuery(q);
        if (q.length < 2) { setSearchResults([]); return; }
        setSearchLoading(true);
        try {
            const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data.success) setSearchResults(data.data);
        } catch {}
        finally { setSearchLoading(false); }
    };

    const handleViewPlayer = async (txId: string) => {
        const res = await fetch(`/api/user/${encodeURIComponent(txId)}`);
        const data = await res.json();
        if (data.success) setViewedPlayer(data.data);
    };

    const handleSendInvite = async (toTxId: string) => {
        if (!registration?._id) return;
        setInviteSending(toTxId); setInviteMsg(null);
        try {
            const res = await fetch("/api/invites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toTxId, eventId: ev._id, registrationId: registration._id }),
            });
            const data = await res.json();
            setInviteMsg({ txId: toTxId, ok: data.success, msg: data.message });
        } catch { setInviteMsg({ txId: toTxId, ok: false, msg: "Network error" }); }
        finally { setInviteSending(null); }
    };

    // ── Team logo upload handler ──
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !registration?._id) return;
        setLogoUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const res = await fetch(`/api/registration/${registration._id}/logo`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageBase64: reader.result }),
                });
                const data = await res.json();
                if (data.success) setTeamLogo(data.teamLogo);
            } catch {}
            finally { setLogoUploading(false); }
        };
        reader.readAsDataURL(file);
    };

    const handleRegister = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const body: any = {
                eventId: ev._id,
                role: selectedRole
            };

            const isSoloRole = selectedRole === "Attendee" || selectedRole === "Volunteer";

            if (ev.type === "team" && !isSoloRole) {
                if (!teamName) {
                    setError("Team name is required.");
                    setLoading(false);
                    return;
                }
                if (members.length + 1 < ev.minTeamSize) {
                    setError(`Minimum team size is ${ev.minTeamSize}.`);
                    setLoading(false);
                    return;
                }
                body.teamName = teamName;
                body.memberTechIds = members.map(m => m.techexoticaId);
            }

            const res = await fetch("/api/events/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Registration successful! Redirecting to profile...");
                setTimeout(() => router.push("/profile"), 2000);
            } else {
                setError(data.message || "Registration failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cx = (...a: any[]) => a.filter(Boolean).join(" ");

    return (
        <div className="ed-root">
            <div className="ed-glow-tl" /><div className="ed-glow-br" />
            <div className="ed-scan" />
            {PARTICLES.map(p => (
                <div key={p.id} className="ed-particle" style={{
                    left: p.left, bottom: p.bottom, width: p.size, height: p.size,
                    background: p.color, animationDuration: p.dur, animationDelay: p.del,
                }} />
            ))}

            {/* ── Nav ── */}
            <nav className={cx("ed-nav", visible && "ed-in")}>
                <button className="ed-back-btn" onClick={() => router.push("/events")}>← Events</button>
                <div className="ed-nav-title">{ev.name}</div>
                <div className="ed-nav-line" />
                <div className="ed-nav-id">EVT-{ev._id.slice(-6)}</div>
            </nav>

            {/* ═══ HERO ═══ */}
            <div className="ed-hero">
                <div className="ed-hero-img-col">
                    <img src={getDefaultEventImage(ev.name)} alt="event hero" className={cx("ed-hero-img", visible && "ed-in")} draggable={false} />
                    <div className="ed-img-lines" />
                    <div className="ed-hero-img-fade" />
                    <div className="ed-hero-img-fade-b" />

                    <div className={cx("ed-hud-circle", visible && "ed-in")}>
                        <div className="ed-hud-circle-inner">TX-2026</div>
                    </div>
                </div>

                <div className="ed-hero-info-col">
                    <div className={cx("ed-hero-content", visible && "ed-in")}>
                        <div className="ed-eyebrow">Techexotica 2026 · {ev.category}</div>
                        <h1 className="ed-event-title">{ev.name}</h1>
                        <div className="ed-tagline">{ev.description?.slice(0, 100)}...</div>

                        <div className="ed-badge-row">
                            <span className="ed-badge" style={{ color: c.color, borderColor: c.border, background: c.bg }}>
                                {c.icon} {ev.category}
                            </span>
                            <span className="ed-badge" style={{
                                color: ev.type === "team" ? "#d28c3c" : "rgba(255,255,255,.4)",
                                borderColor: ev.type === "team" ? "rgba(210,140,60,.3)" : "rgba(255,255,255,.12)",
                                background: ev.type === "team" ? "rgba(210,140,60,.06)" : "transparent",
                            }}>{ev.type}</span>
                        </div>

                        <div className="ed-meta-strip">
                            {[
                                { icon: "◷", label: "Date", val: dateStr },
                                { icon: "◈", label: "Venue", val: ev.venue || "TBA" },
                                { icon: "◉", label: "Team", val: ev.type === "solo" ? "Solo" : ev.minTeamSize + "–" + ev.maxTeamSize + " members" },
                            ].map(({ icon, label, val }) => (
                                <div className="ed-meta-chip" key={label}>
                                    <span className="ed-meta-chip-icon">{icon}</span>
                                    <span>{label}: <strong suppressHydrationWarning>{val}</strong></span>
                                </div>
                            ))}
                        </div>

                        {isRegistered ? (
                            <div className="ed-cta-row">
                                {registration?.type === "team" ? (
                                    <button className="ed-btn-primary" onClick={() => router.push(`/team/${registration._id}`)}>⬡ Team Dashboard</button>
                                ) : (
                                    <button className="ed-btn-primary" onClick={() => setShowPassModal(true)}>⬡ View E-Pass</button>
                                )}
                                <button className="ed-btn-secondary" onClick={() => router.push("/profile")}>◈ View Profile</button>
                            </div>
                        ) : (
                            <div className="ed-cta-row">
                                <button className="ed-btn-primary" onClick={handleRegister} disabled={loading}>
                                    {loading ? "⬡ Processing..." : "⬡ Confirm Registration"}
                                </button>
                                <button className="ed-btn-secondary">◈ Help &amp; Support</button>
                            </div>
                        )}

                        {error && <div style={{ color: '#ff4040', fontSize: 12, marginTop: 12, fontFamily: 'Share Tech Mono' }}>{error}</div>}
                        {success && <div style={{ color: '#00ffc8', fontSize: 12, marginTop: 12, fontFamily: 'Share Tech Mono' }}>{success}</div>}

                    </div>
                </div>
            </div>

            {/* ═══ BODY ═══ */}
            <div className="ed-body">
                <div>
                    <div className="ed-card" style={{ transitionDelay: "0s" }}>
                        <div className="ed-card-top-bar" />
                        <div className="ed-card-pad">
                            <div className="ed-sec-title">About This Event</div>
                            <div className="ed-desc">{ev.description}</div>
                        </div>
                    </div>

                    {/* ── Edit Team panel (shown when registered leader clicks Edit Team) ── */}
                    {isRegistered && ev.type === "team" && isLeader && editMode && (
                        <div className="ed-card ed-in" style={{ transitionDelay: "0s" }}>
                            <div className="ed-card-top-bar" style={{ background: "linear-gradient(to right, rgba(210,140,60,0.6), transparent)" }} />
                            <div className="ed-card-pad">
                                <div className="ed-sec-title">Edit Team — <span style={{ color: "#d28c3c", fontFamily: "Share Tech Mono, monospace", fontSize: 12 }}>{registration?.teamName}</span></div>

                                {editError && <div style={{ color: "#ff4040", fontSize: 12, marginBottom: 12, fontFamily: "Share Tech Mono" }}>{editError}</div>}
                                {editSuccess && <div style={{ color: "#00ffc8", fontSize: 12, marginBottom: 12, fontFamily: "Share Tech Mono" }}>{editSuccess}</div>}

                                <div className="ed-reg-form">
                                    {/* Leader (immutable) */}
                                    <div className="ed-input-group">
                                        <label className="ed-label">Team Leader (You)</label>
                                        <div className="ed-member-item">
                                            <span className="ed-member-name">{user.name}</span>
                                            <span className="ed-member-id">{user.techexoticaId}</span>
                                        </div>
                                    </div>

                                    {/* Current members */}
                                    <div className="ed-input-group">
                                        <label className="ed-label">Members ({editMembers.length + 1}/{ev.maxTeamSize})</label>
                                        <div className="ed-member-list">
                                            {editMembers.map(m => (
                                                <div key={m.techexoticaId} className="ed-member-item">
                                                    <span className="ed-member-name">{m.name}</span>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        <span className="ed-member-id">{m.techexoticaId}</span>
                                                        <Trash2 size={14} style={{ cursor: "pointer", color: "#ff4040" }} onClick={() => handleRemoveMemberEdit(m.techexoticaId)} />
                                                    </div>
                                                </div>
                                            ))}
                                            {editMembers.length === 0 && (
                                                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, padding: "8px 0" }}>No additional members yet.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add member input */}
                                    {editMembers.length + 1 < ev.maxTeamSize && (
                                        <div className="ed-input-group" style={{ marginTop: 8 }}>
                                            <label className="ed-label">Add Members (Search by name, reg no, or TX ID)</label>
                                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                                <input className="ed-input" style={{ flex: 1 }} placeholder="Search players..." value={searchQuery} onChange={e => handleSearch(e.target.value)} />
                                                <button className="ed-btn-secondary" style={{ padding: "0 20px" }} onClick={() => handleSearch(searchQuery)}>
                                                    Search
                                                </button>
                                            </div>
                                            {searchLoading && <div style={{ fontSize: "12px", color: "rgba(0,200,255,0.5)" }}>Searching...</div>}
                                            {searchResults.map(p => (
                                                <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {p.profilePhoto ? <img src={p.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: "13px", color: "#00c8ff" }}>{p.name?.[0]?.toUpperCase()}</span>}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                                                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{p.techexoticaId} · {p.branch} · {p.batch}</div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button onClick={() => handleViewPlayer(p.techexoticaId)} style={{ padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>View</button>
                                                        <button onClick={() => handleAddMemberEdit(p)} style={{ padding: "5px 10px", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Save button */}
                                    <button
                                        className="ed-btn-primary"
                                        style={{ width: "100%", justifyContent: "center" }}
                                        onClick={handleSaveTeam}
                                        disabled={editSaving}
                                    >
                                        {editSaving ? "Saving..." : "⬡ Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isRegistered && allowedRoles.length > 1 && (
                        <div className="ed-card ed-in" style={{ transitionDelay: ".05s", marginBottom: "20px" }}>
                            <div className="ed-card-top-bar" />
                            <div className="ed-card-pad">
                                <div className="ed-sec-title">Select Your Role</div>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {allowedRoles.map((r: string) => (
                                        <button 
                                            key={r} 
                                            onClick={() => setSelectedRole(r)}
                                            style={{
                                                padding: "10px 20px", 
                                                background: selectedRole === r ? "rgba(0,200,255,0.15)" : "rgba(255,255,255,0.05)",
                                                border: `1px solid ${selectedRole === r ? "#00c8ff" : "rgba(255,255,255,0.1)"}`,
                                                color: selectedRole === r ? "#00c8ff" : "#fff",
                                                fontFamily: "Rajdhani, sans-serif",
                                                fontSize: "14px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                                                cursor: "pointer", borderRadius: "4px", transition: "all 0.2s"
                                            }}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {!isRegistered && ev.type === "team" && selectedRole === "Participant" && (
                        <div className="ed-card ed-in" style={{ transitionDelay: ".1s" }}>
                            <div className="ed-card-top-bar" />
                            <div className="ed-card-pad">
                                <div className="ed-sec-title">Team Configuration</div>
                                <div className="ed-reg-form">
                                    <div className="ed-input-group">
                                        <label className="ed-label">Team Name</label>
                                        <input
                                            className="ed-input"
                                            placeholder="Enter team name..."
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                        />
                                    </div>
                                    <div className="ed-input-group">
                                        <label className="ed-label">Team Leader</label>
                                        <div className="ed-member-item">
                                            <span className="ed-member-name">{user.name} (You)</span>
                                            <span className="ed-member-id">{user.techexoticaId}</span>
                                        </div>
                                    </div>
                                    <div className="ed-input-group">
                                        <label className="ed-label">Team Members ({members.length + 1}/{ev.maxTeamSize})</label>
                                        <div className="ed-member-list">
                                            {members.map(m => (
                                                <div key={m.techexoticaId} className="ed-member-item">
                                                    <span className="ed-member-name">{m.name}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <span className="ed-member-id">{m.techexoticaId}</span>
                                                        <Trash2 size={14} style={{ cursor: 'pointer', color: '#ff4040' }} onClick={() => removeMember(m.techexoticaId)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {members.length + 1 < ev.maxTeamSize && (
                                        <div className="ed-input-group" style={{ marginTop: 8 }}>
                                            <label className="ed-label">Add Members (Search by name, reg no, or TX ID)</label>
                                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                                <input className="ed-input" style={{ flex: 1 }} placeholder="Search players..." value={searchQuery} onChange={e => handleSearch(e.target.value)} />
                                                <button className="ed-btn-secondary" style={{ padding: "0 20px" }} onClick={() => handleSearch(searchQuery)}>
                                                    Search
                                                </button>
                                            </div>
                                            {searchLoading && <div style={{ fontSize: "12px", color: "rgba(0,200,255,0.5)" }}>Searching...</div>}
                                            {searchResults.map(p => (
                                                <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {p.profilePhoto ? <img src={p.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: "13px", color: "#00c8ff" }}>{p.name?.[0]?.toUpperCase()}</span>}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                                                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{p.techexoticaId} · {p.branch} · {p.batch}</div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button onClick={() => handleViewPlayer(p.techexoticaId)} style={{ padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>View</button>
                                                        <button onClick={() => handleAddMember(p)} style={{ padding: "5px 10px", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Registration CTA for convenience */}
                    {!isRegistered && (
                        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(0,200,255,0.02)", border: "1px dashed rgba(0,200,255,0.15)", padding: "24px", borderRadius: "8px", alignItems: "center", textAlign: "center" }}>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                                Ready to join as {selectedRole}?
                            </div>
                            <button className="ed-btn-primary" onClick={handleRegister} disabled={loading} style={{ width: "100%", maxWidth: "400px", justifyContent: "center" }}>
                                {loading ? "Processing..." : "⬡ Confirm Registration"}
                            </button>
                        </div>
                    )}

                    {/* Team Logo Upload */}
                    {isRegistered && isLeader && (
                        <div className="ed-card ed-in" style={{ transitionDelay: ".15s" }}>
                            <div className="ed-card-top-bar" />
                            <div className="ed-card-pad">
                                <div className="ed-sec-title">Team Logo</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                                    {teamLogo && <img src={teamLogo} alt="Team Logo" style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(0,200,255,0.3)" }} />}
                                    <label style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.25)", borderRadius: "6px", color: "#00c8ff", fontSize: "12px", letterSpacing: "1px", fontFamily: "'Share Tech Mono',monospace" }}>
                                        {logoUploading ? "Uploading..." : teamLogo ? "Change Logo" : "+ Upload Logo"}
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} style={{ display: "none" }} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Player Search */}
                    {isRegistered && isLeader && ev.type === "team" && (
                        <div className="ed-card ed-in" style={{ transitionDelay: ".2s" }}>
                            <div className="ed-card-top-bar" />
                            <div className="ed-card-pad">
                                <div className="ed-sec-title">Find Players</div>
                                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "14px", fontFamily: "'Share Tech Mono',monospace" }}>Search by name, reg no, or TX ID to invite players.</p>
                                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                    <input className="ed-input" style={{ flex: 1 }} placeholder="Search players..." value={searchQuery} onChange={e => handleSearch(e.target.value)} />
                                    <button className="ed-btn-secondary" style={{ padding: "0 20px" }} onClick={() => handleSearch(searchQuery)}>
                                        Search
                                    </button>
                                </div>
                                {searchLoading && <div style={{ fontSize: "12px", color: "rgba(0,200,255,0.5)" }}>Searching...</div>}
                                {searchResults.map(p => (
                                    <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {p.profilePhoto ? <img src={p.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: "13px", color: "#00c8ff" }}>{p.name?.[0]?.toUpperCase()}</span>}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{p.techexoticaId} · {p.branch} · {p.batch}</div>
                                        </div>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button onClick={() => handleViewPlayer(p.techexoticaId)} style={{ padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>View</button>
                                            <button onClick={() => handleSendInvite(p.techexoticaId)} disabled={inviteSending === p.techexoticaId} style={{ padding: "5px 10px", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", fontSize: "10px", cursor: "pointer", borderRadius: "4px" }}>
                                                {inviteSending === p.techexoticaId ? "..." : "Invite"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {inviteMsg && <div style={{ marginTop: "8px", fontSize: "12px", color: inviteMsg.ok ? "#00ffc8" : "#ff6060", fontFamily: "'Share Tech Mono',monospace" }}>{inviteMsg.ok ? "✓ " : "✕ "}{inviteMsg.msg}</div>}
                            </div>
                        </div>
                    )}

                    {/* Player Profile Modal */}
                    {viewedPlayer && (
                        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
                            onClick={e => { if (e.target === e.currentTarget) setViewedPlayer(null); }}>
                            <div style={{ background: "#0d1117", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "12px", padding: "24px", maxWidth: "400px", width: "100%", position: "relative" }}>
                                <button onClick={() => setViewedPlayer(null)} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "18px", cursor: "pointer" }}>✕</button>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(0,200,255,0.3)", flexShrink: 0, background: "rgba(0,200,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {viewedPlayer.profilePhoto ? <img src={viewedPlayer.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ fontSize: "20px", color: "#00c8ff" }}>{viewedPlayer.name?.[0]?.toUpperCase()}</span>}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#e0e0e0" }}>{viewedPlayer.name}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(0,200,255,0.7)", fontFamily: "monospace" }}>{viewedPlayer.techexoticaId}</div>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                                    {[{ k: "Reg No", v: viewedPlayer.regNo }, { k: "Branch", v: viewedPlayer.branch }, { k: "Batch", v: viewedPlayer.batch }].map(({ k, v }) => (
                                        <div key={k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "8px 10px" }}>
                                            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(0,200,255,0.4)", fontFamily: "monospace", marginBottom: "4px" }}>{k}</div>
                                            <div style={{ fontSize: "13px", color: "#e0e0e0" }}>{v}</div>
                                        </div>
                                    ))}
                                </div>
                                {(viewedPlayer.achievements || []).length > 0 && (
                                    <div style={{ borderTop: "1px solid rgba(255,215,0,0.1)", paddingTop: "12px", marginBottom: "16px" }}>
                                        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,215,0,0.4)", fontFamily: "monospace", marginBottom: "8px" }}>✦ ACHIEVEMENTS</div>
                                        {viewedPlayer.achievements.map((a: any) => (
                                            <div key={a._id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 8px", background: "rgba(255,215,0,0.05)", borderRadius: "4px", marginBottom: "4px" }}>
                                                <span style={{ color: "#ffd700" }}>✔</span>
                                                <span style={{ fontSize: "12px", color: "#ffe066" }}>{a.title}</span>
                                                <span style={{ marginLeft: "auto", fontSize: "9px", color: "rgba(255,215,0,0.4)", border: "1px solid rgba(255,215,0,0.2)", padding: "1px 5px", borderRadius: "3px" }}>VERIFIED</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button onClick={() => handleSendInvite(viewedPlayer.techexoticaId)} disabled={inviteSending === viewedPlayer.techexoticaId}
                                    style={{ width: "100%", padding: "10px", background: "rgba(0,200,255,0.12)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", fontSize: "12px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Share Tech Mono',monospace", borderRadius: "6px" }}>
                                    {inviteSending === viewedPlayer.techexoticaId ? "Sending..." : "⬡ Send Invite"}
                                </button>
                                {inviteMsg?.txId === viewedPlayer.techexoticaId && (
                                    <div style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: inviteMsg?.ok ? "#00ffc8" : "#ff6060", fontFamily: "'Share Tech Mono',monospace" }}>
                                        {inviteMsg?.ok ? "✓ " : "✕ "}{inviteMsg?.msg}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="ed-sidebar">
                    <div className="ed-card" style={{ transitionDelay: ".1s" }}>
                        <div className="ed-card-top-bar" />
                        <div className="ed-card-pad">
                            <div className="ed-sec-title">Event Info</div>
                            <div className="ed-quick-facts">
                                {[
                                    { k: "Category", v: ev.category },
                                    { k: "Type", v: ev.type },
                                    { k: "Team Size", v: ev.type === "solo" ? "Solo" : ev.minTeamSize + "–" + ev.maxTeamSize },
                                    { k: "Date", v: ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA" },
                                    { k: "Venue", v: ev.venue || "TBA" },
                                ].map(({ k, v }) => (
                                    <div className="ed-quick-row" key={k}>
                                        <span className="ed-quick-key">{k}</span>
                                        <span className="ed-quick-val">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendee Pass Modal */}
            {showPassModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4rem 1rem", overflowY: "auto" }}
                    onClick={e => { if (e.target === e.currentTarget) setShowPassModal(false); }}>
                    <div style={{ position: "relative", margin: "auto" }}>
                        <button onClick={() => setShowPassModal(false)} style={{ position: "absolute", top: "-40px", right: "0", background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "24px", cursor: "pointer", zIndex: 10 }}>✕</button>
                        <AttendeePass user={user} event={ev} role={registration?.role || (ev.type === "solo" ? "Participant" : "Attendee")} />
                    </div>
                </div>
            )}
        </div>
    );
}
