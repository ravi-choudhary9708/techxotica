"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ANIME_IMG = "/login_image.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    background: #04030a;
    font-family: 'Barlow Condensed', sans-serif;
    color: #e8e0f0;
    display: flex;
    align-items: stretch;
    position: relative;
    overflow: hidden;
  }

  /* ── Grid bg ── */
  .lg-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
    background-size: 55px 55px;
    pointer-events: none; z-index: 0;
  }

  /* ── Scanline ── */
  .lg-scan {
    position: fixed; left: 0; right: 0;
    height: 2px; top: -2px;
    background: linear-gradient(to right, transparent, rgba(0,200,255,0.2), transparent);
    z-index: 100; pointer-events: none;
    animation: lg-scanline 8s linear infinite 2s;
  }
  @keyframes lg-scanline {
    0%   { top: -2px; opacity: 0; }
    3%   { opacity: 1; }
    97%  { opacity: 0.2; }
    100% { top: 100vh; opacity: 0; }
  }

  /* ── Floating particles ── */
  .lg-particle {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 1;
    animation: lg-drift linear infinite;
  }
  @keyframes lg-drift {
    0%   { transform: translateY(0) scale(0.8); opacity: 0; }
    12%  { opacity: 1; }
    88%  { opacity: 0.4; }
    100% { transform: translateY(-110px) translateX(12px) scale(1.1); opacity: 0; }
  }

  /* ══════════════════════════════════════
     RIGHT side — anime image panel
  ══════════════════════════════════════ */
  .lg-right {
    width: 54%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    order: 2;
  }

  .lg-right-bg {
    position: absolute; inset: 0;
    background: #060010;
  }

  /* Anime image */
  .lg-anime-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
    opacity: 0;
    transform: scale(1.06) translateX(10px);
    transition: opacity 1.1s ease, transform 1.3s ease;
    filter: brightness(0.88) saturate(0.95);
  }
  .lg-anime-img.lg-in {
    opacity: 1;
    transform: scale(1) translateX(0);
    animation: lg-float 9s ease-in-out infinite 2s;
  }
  @keyframes lg-float {
    0%,100% {
      transform: scale(1) translateY(0px);
      filter: brightness(0.88) saturate(0.95) drop-shadow(0 0 20px rgba(0,200,255,0.08));
    }
    50% {
      transform: scale(1.018) translateY(-8px);
      filter: brightness(0.92) saturate(1.05) drop-shadow(0 0 35px rgba(0,200,255,0.18));
    }
  }

  /* CRT scanlines over image */
  .lg-crt {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(
      transparent 0px, transparent 3px,
      rgba(0,200,255,0.012) 4px, transparent 5px
    );
  }

  /* Soft vignette fading left edge into form */
  .lg-img-fade-l {
    position: absolute; inset: 0; z-index: 3;
    background: linear-gradient(
      to left,
      transparent 0%, transparent 45%,
      rgba(4,3,10,0.55) 72%,
      #04030a 100%
    );
  }
  .lg-img-fade-t {
    position: absolute; top: 0; left: 0; right: 0; height: 25%; z-index: 3;
    background: linear-gradient(to bottom, rgba(4,3,10,0.7), transparent);
  }
  .lg-img-fade-b {
    position: absolute; bottom: 0; left: 0; right: 0; height: 25%; z-index: 3;
    background: linear-gradient(to top, rgba(4,3,10,0.65), transparent);
  }

  /* ── HUD elements floating on image ── */
  /* Top-left corner bracket */
  .lg-hud-tl {
    position: absolute; top: 7%; left: 7%; z-index: 5;
    width: 36px; height: 36px;
    border-top: 1px solid rgba(0,200,255,0.45);
    border-left: 1px solid rgba(0,200,255,0.45);
    opacity: 0;
    transition: opacity 0.8s 1s ease;
  }
  .lg-hud-tl.lg-in { opacity: 1; }

  /* Bottom-right corner bracket */
  .lg-hud-br {
    position: absolute; bottom: 7%; right: 7%; z-index: 5;
    width: 36px; height: 36px;
    border-bottom: 1px solid rgba(0,200,255,0.45);
    border-right: 1px solid rgba(0,200,255,0.45);
    opacity: 0;
    transition: opacity 0.8s 1.15s ease;
  }
  .lg-hud-br.lg-in { opacity: 1; }

  /* Crosshair scan circle */
  .lg-hud-ring {
    position: absolute; top: 28%; left: 52%; z-index: 5;
    width: 80px; height: 80px;
    border: 1px solid rgba(0,200,255,0.2);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.8s 1.3s ease;
    animation: lg-ring-rotate 14s linear infinite;
  }
  .lg-hud-ring.lg-in { opacity: 1; }
  @keyframes lg-ring-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .lg-hud-ring::before {
    content: '';
    position: absolute; top: -1px; left: 50%;
    width: 4px; height: 4px;
    background: #00c8ff;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 8px rgba(0,200,255,0.8);
  }

  /* Data readout strip */
  .lg-hud-data {
    position: absolute; bottom: 12%; left: 6%; z-index: 5;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.7s 1.4s ease, transform 0.7s 1.4s ease;
  }
  .lg-hud-data.lg-in { opacity: 1; transform: translateY(0); }
  .lg-hud-data-box {
    padding: 10px 16px;
    background: rgba(0,200,255,0.05);
    border: 1px solid rgba(0,200,255,0.18);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .lg-hud-data-label {
    font-size: 8px; letter-spacing: 4px;
    color: rgba(0,200,255,0.4); text-transform: uppercase;
    margin-bottom: 4px;
  }
  .lg-hud-data-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px; color: #00c8ff; letter-spacing: 2px;
    animation: lg-data-flicker 6s ease-in-out infinite 3s;
  }
  @keyframes lg-data-flicker {
    0%,86%,100% { opacity: 1; }
    88%          { opacity: 0.5; }
    90%          { opacity: 1; }
    93%          { opacity: 0.7; }
  }

  /* ══════════════════════════════════════
     LEFT side — form panel
  ══════════════════════════════════════ */
  .lg-left {
    flex: 1;
    position: relative; z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 5% 48px 6%;
    order: 1;
  }

  .lg-form-wrap {
    width: 100%; max-width: 400px;
    opacity: 0; transform: translateX(-28px);
    transition: opacity 0.75s 0.25s ease, transform 0.75s 0.25s ease;
  }
  .lg-form-wrap.lg-in { opacity: 1; transform: translateX(0); }

  /* Eyebrow */
  .lg-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 5px;
    color: #00c8ff; text-transform: uppercase;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .lg-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: #00c8ff;
    box-shadow: 0 0 6px rgba(0,200,255,0.6);
  }

  /* Title */
  .lg-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 700; line-height: 0.95;
    letter-spacing: 2px; text-transform: uppercase;
    color: #fff; margin-bottom: 6px;
  }
  .lg-title-accent {
    display: block;
    background: linear-gradient(135deg, #00c8ff 0%, #0088cc 60%, #00c8ff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: lg-title-shift 5s ease-in-out infinite;
  }
  @keyframes lg-title-shift {
    0%,100% { background-position: 0% 0%; filter: brightness(1); }
    50%      { background-position: 100% 0%; filter: brightness(1.2) drop-shadow(0 0 8px rgba(0,200,255,0.4)); }
  }

  .lg-subtitle {
    font-size: 13px; color: rgba(255,255,255,0.3);
    letter-spacing: 1px; margin-bottom: 36px;
  }
  .lg-subtitle a {
    color: rgba(0,200,255,0.7); cursor: pointer;
    text-decoration: none; transition: color 0.2s;
  }
  .lg-subtitle a:hover { color: #00c8ff; }

  /* ── TechID info card ── */
  .lg-techid-hint {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px; margin-bottom: 28px;
    background: rgba(0,200,255,0.03);
    border: 1px solid rgba(0,200,255,0.12);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .lg-hint-icon {
    font-size: 16px; color: rgba(0,200,255,0.5); flex-shrink: 0; margin-top: 1px;
  }
  .lg-hint-text {
    font-size: 12px; color: rgba(255,255,255,0.3);
    line-height: 1.55; letter-spacing: 0.3px;
  }
  .lg-hint-text span { color: rgba(0,200,255,0.6); }

  /* ── Field ── */
  .lg-field { margin-bottom: 20px; position: relative; }
  .lg-label {
    display: block;
    font-size: 10px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-bottom: 7px;
    transition: color 0.2s;
  }
  .lg-field:focus-within .lg-label { color: rgba(0,200,255,0.75); }

  .lg-input-wrap { position: relative; }
  .lg-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 12px; color: rgba(255,255,255,0.2);
    pointer-events: none; z-index: 1;
    transition: color 0.2s;
  }
  .lg-field:focus-within .lg-input-icon { color: rgba(0,200,255,0.65); }

  .lg-input {
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
  }
  .lg-input::placeholder { color: rgba(255,255,255,0.16); }
  .lg-input:focus {
    border-color: rgba(0,200,255,0.4);
    background: rgba(0,200,255,0.035);
    box-shadow: 0 0 20px rgba(0,200,255,0.07), inset 0 0 10px rgba(0,200,255,0.02);
  }

  /* Animated underline on focus */
  .lg-input-line {
    position: absolute; bottom: 0; left: 0;
    height: 1px; width: 0%;
    background: linear-gradient(to right, #00c8ff, rgba(0,200,255,0.2));
    box-shadow: 0 0 8px rgba(0,200,255,0.5);
    transition: width 0.35s ease;
    pointer-events: none;
  }
  .lg-field:focus-within .lg-input-line { width: 100%; }

  /* Error */
  .lg-error {
    font-size: 10px; letter-spacing: 1px;
    color: rgba(255,100,100,0.75);
    margin-top: 5px; display: none;
  }
  .lg-error.show { display: block; }

  /* Show password toggle */
  .lg-pw-toggle {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: transparent; border: none;
    color: rgba(255,255,255,0.22);
    font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; z-index: 2;
    font-family: 'Barlow Condensed', sans-serif;
    transition: color 0.2s;
    padding: 4px;
  }
  .lg-pw-toggle:hover { color: rgba(0,200,255,0.6); }

  /* Forgot password */
  .lg-forgot {
    text-align: right; margin-top: -10px; margin-bottom: 20px;
  }
  .lg-forgot a {
    font-size: 11px; letter-spacing: 1px;
    color: rgba(0,200,255,0.45); cursor: pointer;
    text-decoration: none; text-transform: uppercase;
    transition: color 0.2s;
  }
  .lg-forgot a:hover { color: #00c8ff; }

  /* ── Submit button ── */
  .lg-submit {
    width: 100%;
    padding: 15px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700;
    letter-spacing: 5px; text-transform: uppercase;
    background: linear-gradient(135deg, #006688 0%, #00c8ff 50%, #006688 100%);
    background-size: 200% 100%;
    color: #04030a;
    border: none; cursor: pointer;
    position: relative; overflow: hidden;
    transition: background-position 0.4s, box-shadow 0.3s, transform 0.2s;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .lg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .lg-submit:hover {
    background-position: 100% 0;
    box-shadow: 0 0 36px rgba(0,200,255,0.5);
    transform: translateY(-1px);
  }
  .lg-submit:hover::before { transform: translateX(100%); }
  .lg-submit:active { transform: scale(0.98); }
  .lg-submit.loading { pointer-events: none; opacity: 0.65; }

  .lg-submit-inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .lg-submit-arrow {
    font-size: 16px; transition: transform 0.3s;
  }
  .lg-submit:hover .lg-submit-arrow { transform: translateX(5px); }

  /* ── Divider ── */
  .lg-divider {
    display: flex; align-items: center; gap: 14px;
    margin: 22px 0;
  }
  .lg-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .lg-divider-text {
    font-size: 10px; letter-spacing: 3px;
    color: rgba(255,255,255,0.2); text-transform: uppercase;
  }

  /* ── TechID display on success ── */
  .lg-success {
    display: none; text-align: center; padding: 28px 0;
  }
  .lg-success.show { display: block; }
  .lg-success-icon {
    font-size: 44px; margin-bottom: 14px;
    animation: lg-pop 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes lg-pop {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  .lg-success-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 26px; font-weight: 700;
    color: #00c8ff; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .lg-success-sub {
    font-size: 12px; color: rgba(255,255,255,0.3);
    letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── Error shake ── */
  @keyframes lg-shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  .lg-shake { animation: lg-shake 0.4s ease; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .lg-root { flex-direction: column-reverse; }
    .lg-right { width: 100%; height: 45vh; min-height: 280px; order: 1; }
    .lg-left  { order: 2; padding: 36px 20px 60px; }
    .lg-form-wrap { max-width: 100%; }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ regNo: "", password: "" });
  const [errors, setErrors] = useState<{ regNo?: string; password?: string; api?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("lg-styles")) {
      const el = document.createElement("style");
      el.id = "lg-styles";
      el.textContent = styles;
      document.head.appendChild(el);
    }

    // Generate particles on client side to avoid hydration mismatch
    setParticles(Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      bottom: `${Math.random() * 80}%`,
      size: `${2 + Math.random() * 2.5}px`,
      color: i % 4 === 0 ? "rgba(0,200,255,0.55)"
        : i % 4 === 1 ? "rgba(0,200,255,0.3)"
          : i % 4 === 2 ? "rgba(100,220,255,0.4)"
            : "rgba(0,160,200,0.35)",
      dur: `${5 + Math.random() * 8}s`,
      del: `${Math.random() * 7}s`,
    })));

    setTimeout(() => setVisible(true), 80);
  }, []);

  const validate = () => {
    const e: { regNo?: string; password?: string } = {};
    if (!form.regNo.trim()) e.regNo = "Registration number required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleChange = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field as keyof typeof errors]) {
      setErrors(e => {
        const n = { ...e };
        delete n[field as keyof typeof errors];
        return n;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setErrors({ api: err.message });
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  };

  const cx = (...a: any[]) => a.filter(Boolean).join(" ");

  return (
    <div className="lg-root">
      <div className="lg-scan" />
      {particles.map((p: any) => (
        <div key={p.id} className="lg-particle" style={{
          left: p.left, bottom: p.bottom,
          width: p.size, height: p.size,
          background: p.color,
          animationDuration: p.dur,
          animationDelay: p.del,
        } as any} />
      ))}

      {/* ═══ LEFT — FORM ═══ */}
      <div className="lg-left">
        <div className={cx("lg-form-wrap", visible && "lg-in")}>

          <div className="lg-eyebrow">Techexotica 2026</div>
          <div className="lg-title">
            Welcome<br />
            <span className="lg-title-accent">Back</span>
          </div>
          <div className="lg-subtitle">
            New here?{" "}
            <a onClick={() => router.push("/register")}>Create an account →</a>
          </div>

          {/* Hint card */}
          <div className="lg-techid-hint">
            <span className="lg-hint-icon">◈</span>
            <div className="lg-hint-text">
              Use your <span>Registration Number</span> and the password
              you set during signup. Your <span>TechexoticaID</span> was
              sent to you after registration.
            </div>
          </div>

          {/* ── Success ── */}
          <div className={cx("lg-success", success && "show")}>
            <div className="lg-success-icon">⬡</div>
            <div className="lg-success-title">Access Granted</div>
            <div className="lg-success-sub">Redirecting to your profile...</div>
          </div>

          {/* ── Form ── */}
          {!success && (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className={shake ? "lg-shake" : ""}
            >
              {errors.api && (
                <div style={{
                  background: "rgba(255,100,100,0.1)",
                  border: "1px solid rgba(255,100,100,0.3)",
                  color: "#ff7070",
                  padding: "12px",
                  fontSize: "13px",
                  marginBottom: "20px",
                  letterSpacing: "0.5px",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                }}>
                  {errors.api}
                </div>
              )}

              {/* Reg No */}
              <div className="lg-field">
                <label className="lg-label" htmlFor="lg-reg">Registration Number</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">⬡</span>
                  <input
                    id="lg-reg"
                    type="text"
                    className="lg-input"
                    placeholder="e.g. 22CSE001"
                    value={form.regNo}
                    onChange={e => handleChange("regNo", e.target.value)}
                    autoComplete="username"
                  />
                  <div className="lg-input-line" />
                </div>
                {errors.regNo && (
                  <div className="lg-error show">{errors.regNo}</div>
                )}
              </div>

              {/* Password */}
              <div className="lg-field">
                <label className="lg-label" htmlFor="lg-pw">Password</label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">◆</span>
                  <input
                    id="lg-pw"
                    type={showPw ? "text" : "password"}
                    className="lg-input"
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: "60px" }}
                  />
                  <button
                    type="button"
                    className="lg-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                  <div className="lg-input-line" />
                </div>
                {errors.password && (
                  <div className="lg-error show">{errors.password}</div>
                )}
              </div>

              {/* Forgot */}
              <div className="lg-forgot">
                <a onClick={() => router.push("/forgot-password")}>Forgot password?</a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={cx("lg-submit", loading && "loading")}
              >
                <div className="lg-submit-inner">
                  {loading ? (
                    <span style={{ letterSpacing: 4 }}>Authenticating...</span>
                  ) : (
                    <>
                      <span>Enter The Arena</span>
                      <span className="lg-submit-arrow">→</span>
                    </>
                  )}
                </div>
              </button>

              <div className="lg-divider">
                <div className="lg-divider-line" />
                <span className="lg-divider-text">or</span>
                <div className="lg-divider-line" />
              </div>

              <div style={{
                textAlign: "center",
                fontSize: 12, letterSpacing: 1,
                color: "rgba(255,255,255,0.2)"
              }}>
                Don't have a TechexoticaID?{" "}
                <span
                  style={{ color: "rgba(0,200,255,0.55)", cursor: "pointer", textTransform: "uppercase", letterSpacing: 2 }}
                  onClick={() => router.push("/register")}
                >
                  Register →
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ═══ RIGHT — ANIME IMAGE ═══ */}
      <div className="lg-right">
        <div className="lg-right-bg" />

        <img
          src={ANIME_IMG}
          alt="Techexotica"
          className={cx("lg-anime-img", visible && "lg-in")}
          draggable={false}
        />

        {/* CRT scanlines */}
        <div className="lg-crt" />

        {/* Fade edges */}
        <div className="lg-img-fade-l" />
        <div className="lg-img-fade-t" />
        <div className="lg-img-fade-b" />

        {/* HUD decorations */}
        <div className={cx("lg-hud-tl", visible && "lg-in")} />
        <div className={cx("lg-hud-br", visible && "lg-in")} />
        <div className={cx("lg-hud-ring", visible && "lg-in")} />
        <div className={cx("lg-hud-data", visible && "lg-in")}>
          <div className="lg-hud-data-box">
            <div className="lg-hud-data-label">System Status</div>
            <div className="lg-hud-data-val">TX-AUTH · READY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
