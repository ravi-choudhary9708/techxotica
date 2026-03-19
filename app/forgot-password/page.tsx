"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ANIME_IMG = "/login_image.jpg"; // Re-using the same image asset

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fg-root {
    min-height: 100vh;
    background: #04030a;
    font-family: 'Barlow Condensed', sans-serif;
    color: #e8e0f0;
    display: flex;
    align-items: stretch;
    position: relative;
    overflow: hidden;
  }

  .fg-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
    background-size: 55px 55px;
    pointer-events: none; z-index: 0;
  }

  .fg-scan {
    position: fixed; left: 0; right: 0;
    height: 2px; top: -2px;
    background: linear-gradient(to right, transparent, rgba(0,200,255,0.2), transparent);
    z-index: 100; pointer-events: none;
    animation: fg-scanline 8s linear infinite 2s;
  }
  @keyframes fg-scanline {
    0%   { top: -2px; opacity: 0; }
    3%   { opacity: 1; }
    97%  { opacity: 0.2; }
    100% { top: 100vh; opacity: 0; }
  }

  /* Right Side Image */
  .fg-right {
    width: 54%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    order: 2;
  }
  .fg-right-bg { position: absolute; inset: 0; background: #060010; }
  
  .fg-anime-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover; object-position: center top;
    opacity: 0; transform: scale(1.06) translateX(10px);
    transition: opacity 1.1s ease, transform 1.3s ease;
    filter: brightness(0.88) saturate(0.95);
  }
  .fg-anime-img.fg-in {
    opacity: 1; transform: scale(1) translateX(0);
    animation: fg-float 9s ease-in-out infinite 2s;
  }
  @keyframes fg-float {
    0%,100% { transform: scale(1) translateY(0px); filter: brightness(0.88); }
    50% { transform: scale(1.018) translateY(-8px); filter: brightness(0.92); }
  }

  .fg-crt {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(
      transparent 0px, transparent 3px, rgba(0,200,255,0.012) 4px, transparent 5px
    );
  }
  .fg-img-fade-l {
    position: absolute; inset: 0; z-index: 3;
    background: linear-gradient(to left, transparent 0%, transparent 45%, rgba(4,3,10,0.55) 72%, #04030a 100%);
  }
  .fg-img-fade-t { position: absolute; top:0; left:0; right:0; height:25%; z-index:3; background: linear-gradient(to bottom, rgba(4,3,10,0.7), transparent); }
  .fg-img-fade-b { position: absolute; bottom:0; left:0; right:0; height:25%; z-index:3; background: linear-gradient(to top, rgba(4,3,10,0.65), transparent); }

  /* Left Side Form */
  .fg-left {
    flex: 1; position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 5% 48px 6%; order: 1;
  }
  .fg-form-wrap {
    width: 100%; max-width: 400px;
    opacity: 0; transform: translateX(-28px);
    transition: opacity 0.75s 0.25s ease, transform 0.75s 0.25s ease;
  }
  .fg-form-wrap.fg-in { opacity: 1; transform: translateX(0); }

  .fg-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 5px; color: #00c8ff;
    text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
  }
  .fg-eyebrow::before {
    content: ''; display: inline-block; width: 24px; height: 1px;
    background: #00c8ff; box-shadow: 0 0 6px rgba(0,200,255,0.6);
  }

  .fg-title {
    font-family: 'Rajdhani', sans-serif; font-size: clamp(36px, 4vw, 56px);
    font-weight: 700; line-height: 0.95; letter-spacing: 2px;
    text-transform: uppercase; color: #fff; margin-bottom: 16px;
  }

  .fg-subtitle {
    font-size: 13px; color: rgba(255,255,255,0.3);
    letter-spacing: 1px; margin-bottom: 36px; line-height: 1.6;
  }

  /* Field */
  .fg-field { margin-bottom: 24px; position: relative; }
  .fg-label {
    display: block; font-size: 10px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin-bottom: 7px; transition: color 0.2s;
  }
  .fg-field:focus-within .fg-label { color: rgba(0,200,255,0.75); }

  .fg-input-wrap { position: relative; }
  .fg-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 14px; color: rgba(255,255,255,0.2); pointer-events: none;
    z-index: 1; transition: color 0.2s;
  }
  .fg-field:focus-within .fg-input-icon { color: rgba(0,200,255,0.65); }

  .fg-input {
    width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    color: #f0e8ff; font-family: 'Barlow Condensed', sans-serif; font-size: 15px;
    letter-spacing: 0.5px; padding: 12px 14px 12px 40px; outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .fg-input::placeholder { color: rgba(255,255,255,0.16); }
  .fg-input:focus {
    border-color: rgba(0,200,255,0.4); background: rgba(0,200,255,0.035);
    box-shadow: 0 0 20px rgba(0,200,255,0.07), inset 0 0 10px rgba(0,200,255,0.02);
  }

  .fg-input-line {
    position: absolute; bottom: 0; left: 0; height: 1px; width: 0%;
    background: linear-gradient(to right, #00c8ff, rgba(0,200,255,0.2));
    box-shadow: 0 0 8px rgba(0,200,255,0.5); transition: width 0.35s ease;
    pointer-events: none;
  }
  .fg-field:focus-within .fg-input-line { width: 100%; }

  .fg-error {
    font-size: 10px; letter-spacing: 1px; color: rgba(255,100,100,0.75);
    margin-top: 5px; display: none;
  }
  .fg-error.show { display: block; }

  /* Submit */
  .fg-submit {
    width: 100%; padding: 15px; font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase;
    background: linear-gradient(135deg, #006688 0%, #00c8ff 50%, #006688 100%);
    background-size: 200% 100%; color: #04030a; border: none; cursor: pointer;
    position: relative; overflow: hidden;
    transition: background-position 0.4s, box-shadow 0.3s, transform 0.2s;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .fg-submit::before {
    content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .fg-submit:hover { background-position: 100% 0; box-shadow: 0 0 36px rgba(0,200,255,0.5); transform: translateY(-1px); }
  .fg-submit:hover::before { transform: translateX(100%); }
  .fg-submit:active { transform: scale(0.98); }
  .fg-submit.loading { pointer-events: none; opacity: 0.65; }
  
  .fg-submit-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }

  /* Back to Login */
  .fg-back {
    margin-top: 24px; text-align: center;
  }
  .fg-back a {
    font-size: 12px; letter-spacing: 2px; color: rgba(0,200,255,0.5); cursor: pointer;
    text-transform: uppercase; text-decoration: none; transition: color 0.2s;
  }
  .fg-back a:hover { color: #00c8ff; }

  /* Success Card */
  .fg-success-card {
    padding: 24px; background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.2);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    text-align: center; margin-bottom: 24px;
  }
  .fg-success-icon { font-size: 40px; margin-bottom: 12px; color: #00c8ff; }
  .fg-success-title { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .fg-success-text { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; letter-spacing: 0.5px; }

  @keyframes fg-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
  .fg-shake { animation: fg-shake 0.4s ease; }

  @media (max-width: 768px) {
    .fg-root { flex-direction: column-reverse; }
    .fg-right { width: 100%; height: 40vh; min-height: 240px; order: 1; }
    .fg-left  { order: 2; padding: 36px 20px 60px; }
    .fg-form-wrap { max-width: 100%; }
  }
`;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("fg-styles")) {
      const el = document.createElement("style");
      el.id = "fg-styles";
      el.textContent = styles;
      document.head.appendChild(el);
    }
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setError("");
    setApiError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to request password reset");
      }

      setSuccess(true);
    } catch (err: any) {
      setApiError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  };

  const cx = (...a: any[]) => a.filter(Boolean).join(" ");

  return (
    <div className="fg-root">
      <div className="fg-scan" />

      {/* ═══ LEFT — FORM ═══ */}
      <div className="fg-left">
        <div className={cx("fg-form-wrap", visible && "fg-in")}>
          <div className="fg-eyebrow">Identity Recovery</div>
          <div className="fg-title">Reset Password</div>

          {success ? (
             <div className="fg-success-card">
              <div className="fg-success-icon">✉</div>
              <div className="fg-success-title">Transmission Sent</div>
              <div className="fg-success-text">
                If the email exists in our mainframe, a secure transmission with reset instructions has been sent to your inbox.
              </div>
             </div>
          ) : (
            <>
              <div className="fg-subtitle">
                Enter your registered email address and we will securely dispatch a reset link to your terminal.
              </div>

              <form ref={formRef} onSubmit={handleSubmit} noValidate className={shake ? "fg-shake" : ""}>
                {apiError && (
                  <div style={{
                    background: "rgba(255,100,100,0.1)",
                    border: "1px solid rgba(255,100,100,0.3)",
                    color: "#ff7070", padding: "12px", fontSize: "13px",
                    marginBottom: "20px", letterSpacing: "0.5px",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                  }}>
                    {apiError}
                  </div>
                )}

                <div className="fg-field">
                  <label className="fg-label" htmlFor="fg-email">Email Address</label>
                  <div className="fg-input-wrap">
                    <span className="fg-input-icon">✉</span>
                    <input
                      id="fg-email" type="email" className="fg-input"
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      autoComplete="email"
                    />
                    <div className="fg-input-line" />
                  </div>
                  {error && <div className="fg-error show">{error}</div>}
                </div>

                <button type="submit" className={cx("fg-submit", loading && "loading")}>
                  <div className="fg-submit-inner">
                    {loading ? <span style={{ letterSpacing: 4 }}>Processing...</span> : <span>Send Reset Link</span>}
                  </div>
                </button>
              </form>
            </>
          )}

          <div className="fg-back">
            <Link href="/login">← Return to Login</Link>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT — ANIME IMAGE ═══ */}
      <div className="fg-right">
        <div className="fg-right-bg" />
        <img src={ANIME_IMG} alt="Techexotica" className={cx("fg-anime-img", visible && "fg-in")} draggable={false} />
        <div className="fg-crt" />
        <div className="fg-img-fade-l" />
        <div className="fg-img-fade-t" />
        <div className="fg-img-fade-b" />
      </div>
    </div>
  );
}
