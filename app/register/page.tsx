"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ANIME_IMG = "/anime.jpg";

const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "IT", "CHE", "MCA", "MBA"];
const BATCHES = ["2022", "2023", "2024", "2025"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-root {
    min-height: 100vh;
    background: #04030a;
    font-family: 'Barlow Condensed', sans-serif;
    color: #e8e0f0;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: stretch;
  }

  /* ═══ GRID BG ═══ */
  .rg-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,30,30,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,30,30,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none; z-index: 0;
  }

  /* ═══ SCANLINE ═══ */
  .rg-scan {
    position: fixed; left:0; right:0; height:2px;
    background: linear-gradient(to right, transparent, rgba(255,30,30,0.3), transparent);
    top: -2px; z-index: 100; pointer-events: none;
    animation: rg-scanline 7s linear infinite 1s;
  }
  @keyframes rg-scanline {
    0%   { top:-2px; opacity:0; }
    3%   { opacity:1; }
    97%  { opacity:0.25; }
    100% { top:100vh; opacity:0; }
  }

  /* ═══ LEFT — ANIME PANEL ═══ */
  .rg-left {
    width: 52%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* Dark base */
  .rg-left-bg {
    position: absolute; inset: 0;
    background: #080008;
  }

  /* The anime image */
  .rg-anime-img {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
    opacity: 0;
    transform: scale(1.06);
    transition: opacity 1s ease, transform 1s ease;
    filter: saturate(1.1) brightness(0.85) contrast(1.05);
  }
  .rg-anime-img.rg-in {
    opacity: 1;
    transform: scale(1);
    animation: rg-img-breathe 8s ease-in-out infinite 1.5s;
  }
  @keyframes rg-img-breathe {
    0%,100% { transform: scale(1) translateY(0px); filter: saturate(1.1) brightness(0.85) contrast(1.05); }
    50%      { transform: scale(1.025) translateY(-6px); filter: saturate(1.2) brightness(0.9) contrast(1.1); }
  }

  /* Red eye glow overlay — pulses on the eye region */
  .rg-eye-glow {
    position: absolute;
    top: 28%; left: 34%;
    width: 220px; height: 120px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255,20,20,0.55) 0%, rgba(255,0,0,0.15) 50%, transparent 75%);
    pointer-events: none;
    animation: rg-eye-pulse 2s ease-in-out infinite;
    mix-blend-mode: screen;
    z-index: 3;
  }
  @keyframes rg-eye-pulse {
    0%,100% { opacity: 0.7; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.15); }
  }

  /* Blood splatter particles */
  .rg-splatter {
    position: absolute;
    border-radius: 50%;
    background: #cc0000;
    pointer-events: none;
    z-index: 4;
    animation: rg-splat linear infinite;
  }
  @keyframes rg-splat {
    0%   { transform: translate(0,0) scale(0); opacity:0; }
    10%  { opacity: 0.7; transform: translate(var(--tx), var(--ty)) scale(1); }
    80%  { opacity: 0.4; }
    100% { transform: translate(calc(var(--tx)*2.5), calc(var(--ty)*2.5)) scale(0.3); opacity:0; }
  }

  /* Energy cracks */
  .rg-crack {
    position: absolute;
    pointer-events: none; z-index: 4;
    opacity: 0;
    animation: rg-crack-flash 4s ease-in-out infinite var(--d, 0s);
  }
  @keyframes rg-crack-flash {
    0%,85%,100% { opacity: 0; }
    87%          { opacity: 0.9; }
    90%          { opacity: 0.3; }
    93%          { opacity: 0.8; }
  }

  /* Dark gradient overlay — right edge fades into form */
  .rg-left-fade {
    position: absolute; inset: 0;
    background: linear-gradient(
      to right,
      transparent 0%,
      transparent 55%,
      rgba(4,3,10,0.6) 75%,
      #04030a 100%
    );
    z-index: 5;
  }
  /* Bottom vignette */
  .rg-left-fade-b {
    position: absolute; bottom: 0; left: 0; right: 0; height: 35%;
    background: linear-gradient(to top, rgba(4,3,10,0.9), transparent);
    z-index: 5;
  }

  /* Overlay text on image */
  .rg-left-text {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 6;
    padding: 32px 36px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.8s 0.6s ease, transform 0.8s 0.6s ease;
  }
  .rg-left-text.rg-in { opacity: 1; transform: translateY(0); }

  .rg-left-tag {
    font-size: 10px; font-weight: 700;
    letter-spacing: 5px; color: rgba(255,60,60,0.7);
    text-transform: uppercase; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .rg-left-tag::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: rgba(255,60,60,0.6);
  }

  .rg-left-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(36px, 4vw, 58px);
    font-weight: 700; line-height: 0.95;
    letter-spacing: 1px; text-transform: uppercase;
    color: #fff;
    text-shadow: 0 0 40px rgba(255,0,0,0.4);
  }
  .rg-left-title span {
    display: block; color: #ff2020;
    animation: rg-red-flicker 5s ease-in-out infinite 2s;
  }
  @keyframes rg-red-flicker {
    0%,88%,100% { text-shadow: 0 0 30px rgba(255,0,0,0.6); opacity:1; }
    90%          { text-shadow: 0 0 60px rgba(255,0,0,1); opacity:0.8; }
    92%          { text-shadow: 0 0 30px rgba(255,0,0,0.6); opacity:1; }
    95%          { text-shadow: 0 0 80px rgba(255,0,0,0.9); opacity:0.9; }
  }

  .rg-left-sub {
    font-size: 12px; letter-spacing: 3px;
    color: rgba(255,255,255,0.25); margin-top: 8px;
    text-transform: uppercase;
  }

  /* ═══ RIGHT — FORM PANEL ═══ */
  .rg-right {
    flex: 1;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px 48px 24px;
  }

  .rg-form-wrap {
    width: 100%; max-width: 420px;
    opacity: 0; transform: translateX(30px);
    transition: opacity 0.7s 0.3s ease, transform 0.7s 0.3s ease;
  }
  .rg-form-wrap.rg-in { opacity: 1; transform: translateX(0); }

  /* Form header */
  .rg-form-header { margin-bottom: 32px; }
  .rg-form-eyebrow {
    font-size: 10px; font-weight: 700;
    letter-spacing: 5px; color: rgba(255,60,60,0.7);
    text-transform: uppercase; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .rg-form-eyebrow::after {
    content: '';
    flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(255,60,60,0.4), transparent);
  }

  .rg-form-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 36px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    color: #f0e8ff; line-height: 1;
    margin-bottom: 6px;
  }
  .rg-form-sub {
    font-size: 13px; color: rgba(255,255,255,0.3);
    letter-spacing: 1px;
  }
  .rg-form-sub span {
    color: rgba(255,60,60,0.7);
    cursor: pointer; text-decoration: none;
    transition: color 0.2s;
  }
  .rg-form-sub span:hover { color: #ff4040; }

  /* ── Field ── */
  .rg-field { margin-bottom: 18px; position: relative; }

  .rg-label {
    display: block;
    font-size: 10px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 7px;
    transition: color 0.2s;
  }
  .rg-field:focus-within .rg-label { color: rgba(255,60,60,0.8); }

  .rg-input-wrap {
    position: relative;
  }
  .rg-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 13px; color: rgba(255,255,255,0.2);
    pointer-events: none;
    transition: color 0.2s;
    z-index: 1;
  }
  .rg-field:focus-within .rg-input-icon { color: rgba(255,60,60,0.7); }

  .rg-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #f0e8ff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px; font-weight: 400;
    letter-spacing: 0.5px;
    padding: 12px 14px 12px 40px;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    -webkit-appearance: none;
    appearance: none;
  }
  .rg-input::placeholder { color: rgba(255,255,255,0.18); }
  .rg-input:focus {
    border-color: rgba(255,40,40,0.45);
    background: rgba(255,20,20,0.04);
    box-shadow: 0 0 20px rgba(255,0,0,0.08), inset 0 0 10px rgba(255,0,0,0.03);
  }

  /* Select override */
  .rg-select {
    cursor: pointer;
    color: rgba(255,255,255,0.5);
  }
  .rg-select.has-value { color: #f0e8ff; }
  .rg-select option { background: #0d0010; color: #f0e8ff; }

  /* Input bottom line animation */
  .rg-input-line {
    position: absolute; bottom: 0; left: 0;
    height: 1px; width: 0%;
    background: linear-gradient(to right, #ff2020, rgba(255,20,20,0.3));
    box-shadow: 0 0 8px rgba(255,0,0,0.5);
    transition: width 0.35s ease;
    pointer-events: none;
  }
  .rg-field:focus-within .rg-input-line { width: 100%; }

  /* Error message */
  .rg-error {
    font-size: 11px; letter-spacing: 1px;
    color: rgba(255,80,80,0.8);
    margin-top: 5px; display: none;
  }
  .rg-error.show { display: block; }

  /* Grid row for batch + branch */
  .rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* ── Submit button ── */
  .rg-submit {
    width: 100%; margin-top: 8px;
    padding: 15px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700;
    letter-spacing: 5px; text-transform: uppercase;
    background: linear-gradient(135deg, #cc0000 0%, #ff2020 50%, #cc0000 100%);
    background-size: 200% 100%;
    color: #fff;
    border: none; cursor: pointer;
    position: relative; overflow: hidden;
    transition: background-position 0.4s, box-shadow 0.3s, transform 0.2s;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .rg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .rg-submit:hover { background-position: 100% 0; box-shadow: 0 0 35px rgba(255,0,0,0.5); transform: translateY(-1px); }
  .rg-submit:hover::before { transform: translateX(100%); }
  .rg-submit:active { transform: scale(0.98); }
  .rg-submit.loading { pointer-events: none; opacity: 0.7; }

  .rg-submit-inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .rg-submit-arrow {
    font-size: 18px;
    transition: transform 0.3s;
  }
  .rg-submit:hover .rg-submit-arrow { transform: translateX(4px); }

  /* ── TechID preview ── */
  .rg-techid-preview {
    margin-top: 20px; padding: 14px 16px;
    background: rgba(255,20,20,0.04);
    border: 1px solid rgba(255,40,40,0.15);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    display: flex; align-items: center; justify-content: space-between;
    opacity: 0; transition: opacity 0.4s ease;
  }
  .rg-techid-preview.show { opacity: 1; }
  .rg-techid-label {
    font-size: 9px; letter-spacing: 3px;
    color: rgba(255,60,60,0.5); text-transform: uppercase;
  }
  .rg-techid-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 15px; color: #ff4040;
    text-shadow: 0 0 12px rgba(255,0,0,0.5);
    letter-spacing: 2px;
  }

  /* ── Success state ── */
  .rg-success {
    display: none;
    text-align: center;
    padding: 32px 0;
  }
  .rg-success.show { display: block; }
  .rg-success-icon {
    font-size: 48px; margin-bottom: 16px;
    animation: rg-pop 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes rg-pop {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  .rg-success-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #ff4040; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .rg-success-sub {
    font-size: 13px; color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
  }
  .rg-success-id {
    margin-top: 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px; color: #ff4040;
    text-shadow: 0 0 20px rgba(255,0,0,0.6);
    letter-spacing: 3px;
    animation: rg-flicker 5s ease-in-out infinite 1s;
  }
  @keyframes rg-flicker {
    0%,90%,100% { opacity:1; }
    92% { opacity:0.5; }
    94% { opacity:1; }
    97% { opacity:0.7; }
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 768px) {
    .rg-root { flex-direction: column; }
    .rg-left { width: 100%; height: 45vh; min-height: 300px; }
    .rg-right { padding: 32px 20px 60px; }
    .rg-form-wrap { max-width: 100%; }
  }
`;

// Splatter particles config
const SPLATTERS = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${20 + Math.random() * 65}%`,
    left: `${5 + Math.random() * 80}%`,
    size: `${3 + Math.random() * 8}px`,
    tx: `${(Math.random() - 0.5) * 60}px`,
    ty: `${(Math.random() - 0.5) * 60}px`,
    dur: `${4 + Math.random() * 6}s`,
    del: `${Math.random() * 8}s`,
}));

export default function RegisterPage() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState({ name: "", regNo: "", phone: "", batch: "", branch: "", password: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (!document.getElementById("rg-styles")) {
            const el = document.createElement("style");
            el.id = "rg-styles";
            el.textContent = styles;
            document.head.appendChild(el);
        }
        setTimeout(() => setVisible(true), 80);
    }, []);

    const techId = form.phone.length >= 5 && form.batch
        ? `TX-${form.phone.slice(0, 5)}-${form.batch}`
        : null;

    const validate = () => {
        const e: { [key: string]: string } = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.regNo.trim()) e.regNo = "Registration number required";
        if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
        if (!form.batch) e.batch = "Select your batch";
        if (!form.branch) e.branch = "Select your branch";
        if (form.password.length < 6) e.password = "Min 6 characters";
        return e;
    };

    const handleChange = (field: string, val: string) => {
        setForm(f => ({ ...f, [field]: val }));
        if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
        if (apiError) setApiError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setApiError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => router.push("/dashboard"), 3000);
            } else {
                setApiError(data.message || "Registration failed. Try again.");
            }
        } catch (err) {
            setApiError("A network error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cx = (...a: any[]) => a.filter(Boolean).join(" ");

    const Field = ({ id, label, icon, type = "text", placeholder, field, error }: any) => (
        <div className="rg-field">
            <label className="rg-label" htmlFor={id}>{label}</label>
            <div className="rg-input-wrap">
                <span className="rg-input-icon">{icon}</span>
                <input
                    id={id}
                    type={type}
                    className="rg-input"
                    placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    autoComplete="off"
                />
                <div className="rg-input-line" />
            </div>
            {error && <div className={cx("rg-error", "show")}>{error}</div>}
        </div>
    );

    return (
        <div className="rg-root">
            <div className="rg-scan" />

            {/* ═══ LEFT — ANIME ═══ */}
            <div className="rg-left">
                <div className="rg-left-bg" />

                {/* The image */}
                <img
                    src={ANIME_IMG}
                    alt="Techexotica warrior"
                    className={cx("rg-anime-img", visible && "rg-in")}
                    draggable={false}
                />

                {/* Red eye glow */}
                <div className="rg-eye-glow" />

                {/* Blood splatter particles */}
                {SPLATTERS.map(s => (
                    <div key={s.id} className="rg-splatter" style={{
                        top: s.top, left: s.left,
                        width: s.size, height: s.size,
                        "--tx": s.tx, "--ty": s.ty,
                        animationDuration: s.dur,
                        animationDelay: s.del,
                    } as any} />
                ))}

                {/* Vignettes */}
                <div className="rg-left-fade" />
                <div className="rg-left-fade-b" />

                {/* Text overlay */}
                <div className={cx("rg-left-text", visible && "rg-in")}>
                    <div className="rg-left-tag">Techexotica 2026</div>
                    <div className="rg-left-title">
                        Enter The<br /><span>Arena</span>
                    </div>
                    <div className="rg-left-sub">GEC Madhubani · March 2026</div>
                </div>
            </div>

            {/* ═══ RIGHT — FORM Panel ═══ */}
            <div className="rg-right">
                <div className={cx("rg-form-wrap", visible && "rg-in")}>

                    {/* Form header */}
                    <div className="rg-form-header">
                        <div className="rg-form-eyebrow">Create Account</div>
                        <div className="rg-form-title">Register</div>
                        <div className="rg-form-sub">
                            Already have an account?{" "}
                            <Link href="/login"><span style={{ color: '#ff4040', cursor: 'pointer' }}>Sign in →</span></Link>
                        </div>
                    </div>

                    {/* ── Success screen ── */}
                    <div className={cx("rg-success", submitted && "show")}>
                        <div className="rg-success-icon">⬡</div>
                        <div className="rg-success-title">You're In</div>
                        <div className="rg-success-sub">Your account has been created successfully</div>
                        {techId && <div className="rg-success-id">{techId}</div>}
                        <div className="rg-success-sub" style={{ marginTop: 8 }}>Your Techexotica ID</div>
                        <div className="rg-success-sub" style={{ marginTop: 24, opacity: 0.5 }}>Redirecting to dashboard...</div>
                    </div>

                    {/* ── Form ── */}
                    {!submitted && (
                        <form onSubmit={handleSubmit} noValidate>
                            {apiError && (
                                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6 text-red-500 text-sm font-medium animate-in fade-in duration-300">
                                    {apiError}
                                </div>
                            )}

                            <Field
                                id="rg-name" label="Full Name" icon="◈"
                                placeholder="Rahul Kumar"
                                field="name" error={errors.name}
                            />
                            <Field
                                id="rg-reg" label="Registration Number" icon="⬡"
                                placeholder="22CSE001"
                                field="regNo" error={errors.regNo}
                            />
                            <Field
                                id="rg-phone" label="Phone Number" icon="◷"
                                type="tel" placeholder="9876543210"
                                field="phone" error={errors.phone}
                            />

                            <div className="rg-row">
                                {/* Batch */}
                                <div className="rg-field">
                                    <label className="rg-label" htmlFor="rg-batch">Batch</label>
                                    <div className="rg-input-wrap">
                                        <span className="rg-input-icon">◉</span>
                                        <select
                                            id="rg-batch"
                                            className={cx("rg-input rg-select", form.batch && "has-value")}
                                            value={form.batch}
                                            onChange={e => handleChange("batch", e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <div className="rg-input-line" />
                                    </div>
                                    {errors.batch && <div className="rg-error show">{errors.batch}</div>}
                                </div>

                                {/* Branch */}
                                <div className="rg-field">
                                    <label className="rg-label" htmlFor="rg-branch">Branch</label>
                                    <div className="rg-input-wrap">
                                        <span className="rg-input-icon">◈</span>
                                        <select
                                            id="rg-branch"
                                            className={cx("rg-input rg-select", form.branch && "has-value")}
                                            value={form.branch}
                                            onChange={e => handleChange("branch", e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <div className="rg-input-line" />
                                    </div>
                                    {errors.branch && <div className="rg-error show">{errors.branch}</div>}
                                </div>
                            </div>

                            <Field
                                id="rg-pw" label="Password" icon="◆"
                                type="password" placeholder="Min 6 characters"
                                field="password" error={errors.password}
                            />

                            {/* TechID preview */}
                            <div className={cx("rg-techid-preview", techId && "show")}>
                                <span className="rg-techid-label">Your Techexotica ID</span>
                                <span className="rg-techid-value">{techId || ""}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={cx("rg-submit", loading && "loading")}
                                style={{ marginTop: 20 }}
                            >
                                <div className="rg-submit-inner">
                                    {loading ? (
                                        <span style={{ letterSpacing: 4 }}>Registering...</span>
                                    ) : (
                                        <>
                                            <span>Enter The Arena</span>
                                            <span className="rg-submit-arrow">→</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
