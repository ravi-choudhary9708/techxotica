"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ANIME_IMG = "/login_image.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .rp-root { min-height: 100vh; background: #04030a; font-family: 'Barlow Condensed', sans-serif; color: #e8e0f0; display: flex; align-items: stretch; position: relative; overflow: hidden; }
  .rp-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px); background-size: 55px 55px; pointer-events: none; z-index: 0; }
  .rp-scan { position: fixed; left: 0; right: 0; height: 2px; top: -2px; background: linear-gradient(to right, transparent, rgba(0,200,255,0.2), transparent); z-index: 100; pointer-events: none; animation: rp-scanline 8s linear infinite 2s; }
  @keyframes rp-scanline { 0% { top: -2px; opacity: 0; } 3% { opacity: 1; } 97% { opacity: 0.2; } 100% { top: 100vh; opacity: 0; } }

  .rp-right { width: 54%; position: relative; overflow: hidden; flex-shrink: 0; order: 2; }
  .rp-right-bg { position: absolute; inset: 0; background: #060010; }
  .rp-anime-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; opacity: 0; transform: scale(1.06) translateX(10px); transition: opacity 1.1s ease, transform 1.3s ease; filter: brightness(0.88) saturate(0.95); }
  .rp-anime-img.rp-in { opacity: 1; transform: scale(1) translateX(0); animation: rp-float 9s ease-in-out infinite 2s; }
  @keyframes rp-float { 0%,100% { transform: scale(1) translateY(0px); filter: brightness(0.88); } 50% { transform: scale(1.018) translateY(-8px); filter: brightness(0.92); } }
  .rp-crt { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: repeating-linear-gradient(transparent 0px, transparent 3px, rgba(0,200,255,0.012) 4px, transparent 5px); }
  .rp-img-fade-l { position: absolute; inset: 0; z-index: 3; background: linear-gradient(to left, transparent 0%, transparent 45%, rgba(4,3,10,0.55) 72%, #04030a 100%); }
  .rp-img-fade-t { position: absolute; top:0; left:0; right:0; height:25%; z-index:3; background: linear-gradient(to bottom, rgba(4,3,10,0.7), transparent); }
  .rp-img-fade-b { position: absolute; bottom:0; left:0; right:0; height:25%; z-index:3; background: linear-gradient(to top, rgba(4,3,10,0.65), transparent); }

  .rp-left { flex: 1; position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; padding: 48px 5% 48px 6%; order: 1; }
  .rp-form-wrap { width: 100%; max-width: 400px; opacity: 0; transform: translateX(-28px); transition: opacity 0.75s 0.25s ease, transform 0.75s 0.25s ease; }
  .rp-form-wrap.rp-in { opacity: 1; transform: translateX(0); }

  .rp-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 5px; color: #00c8ff; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .rp-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1px; background: #00c8ff; box-shadow: 0 0 6px rgba(0,200,255,0.6); }
  .rp-title { font-family: 'Rajdhani', sans-serif; font-size: clamp(36px, 4vw, 56px); font-weight: 700; line-height: 0.95; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 16px; }
  .rp-subtitle { font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 1px; margin-bottom: 36px; line-height: 1.6; }

  .rp-field { margin-bottom: 24px; position: relative; }
  .rp-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 7px; transition: color 0.2s; }
  .rp-field:focus-within .rp-label { color: rgba(0,200,255,0.75); }

  .rp-input-wrap { position: relative; }
  .rp-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; color: rgba(255,255,255,0.2); pointer-events: none; z-index: 1; transition: color 0.2s; }
  .rp-field:focus-within .rp-input-icon { color: rgba(0,200,255,0.65); }

  .rp-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #f0e8ff; font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 0.5px; padding: 12px 14px 12px 40px; outline: none; transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
  .rp-input::placeholder { color: rgba(255,255,255,0.16); }
  .rp-input:focus { border-color: rgba(0,200,255,0.4); background: rgba(0,200,255,0.035); box-shadow: 0 0 20px rgba(0,200,255,0.07), inset 0 0 10px rgba(0,200,255,0.02); }
  .rp-pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: rgba(255,255,255,0.22); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; z-index: 2; font-family: 'Barlow Condensed', sans-serif; transition: color 0.2s; padding: 4px; }
  .rp-pw-toggle:hover { color: rgba(0,200,255,0.6); }

  .rp-input-line { position: absolute; bottom: 0; left: 0; height: 1px; width: 0%; background: linear-gradient(to right, #00c8ff, rgba(0,200,255,0.2)); box-shadow: 0 0 8px rgba(0,200,255,0.5); transition: width 0.35s ease; pointer-events: none; }
  .rp-field:focus-within .rp-input-line { width: 100%; }

  .rp-error { font-size: 10px; letter-spacing: 1px; color: rgba(255,100,100,0.75); margin-top: 5px; display: none; }
  .rp-error.show { display: block; }

  .rp-submit { width: 100%; padding: 15px; font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; background: linear-gradient(135deg, #006688 0%, #00c8ff 50%, #006688 100%); background-size: 200% 100%; color: #04030a; border: none; cursor: pointer; position: relative; overflow: hidden; transition: background-position 0.4s, box-shadow 0.3s, transform 0.2s; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); }
  .rp-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%); transform: translateX(-100%); transition: transform 0.5s ease; }
  .rp-submit:hover { background-position: 100% 0; box-shadow: 0 0 36px rgba(0,200,255,0.5); transform: translateY(-1px); }
  .rp-submit:hover::before { transform: translateX(100%); }
  .rp-submit:active { transform: scale(0.98); }
  .rp-submit.loading { pointer-events: none; opacity: 0.65; }
  .rp-submit-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }

  .rp-back { margin-top: 24px; text-align: center; }
  .rp-back a { font-size: 12px; letter-spacing: 2px; color: rgba(0,200,255,0.5); cursor: pointer; text-transform: uppercase; text-decoration: none; transition: color 0.2s; }
  .rp-back a:hover { color: #00c8ff; }

  .rp-success-card { padding: 24px; background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.2); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); text-align: center; margin-bottom: 24px; }
  .rp-success-icon { font-size: 40px; margin-bottom: 12px; color: #00c8ff; }
  .rp-success-title { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .rp-success-text { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; letter-spacing: 0.5px; }

  @keyframes rp-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
  .rp-shake { animation: rp-shake 0.4s ease; }

  @media (max-width: 768px) { .rp-root { flex-direction: column-reverse; } .rp-right { width: 100%; height: 40vh; min-height: 240px; order: 1; } .rp-left  { order: 2; padding: 36px 20px 60px; } .rp-form-wrap { max-width: 100%; } }
`;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("rp-styles")) {
      const el = document.createElement("style");
      el.id = "rp-styles";
      el.textContent = styles;
      document.head.appendChild(el);
    }
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    setError("");
    setApiError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setApiError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  };

  const cx = (...a: any[]) => a.filter(Boolean).join(" ");

  if (!token) {
    return (
      <div className={cx("rp-form-wrap", visible && "rp-in")}>
         <div className="rp-eyebrow">Error</div>
         <div className="rp-title">Invalid Link</div>
         <div className="rp-subtitle">No reset token found in the URL. Please request a new link.</div>
         <div className="rp-back">
            <Link href="/forgot-password">← Request New Link</Link>
          </div>
      </div>
    );
  }

  return (
    <div className={cx("rp-form-wrap", visible && "rp-in")}>
      <div className="rp-eyebrow">Identity Recovery</div>
      <div className="rp-title">New Password</div>

      {success ? (
         <div className="rp-success-card">
          <div className="rp-success-icon">✓</div>
          <div className="rp-success-title">Password Assured</div>
          <div className="rp-success-text">
            Your credentials have been securely updated in the database.
            <br/><br/>
            Redirecting to login portal...
          </div>
         </div>
      ) : (
        <>
          <div className="rp-subtitle">
            Please enter your new strong password below to secure your account.
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className={shake ? "rp-shake" : ""}>
            {apiError && (
              <div style={{
                background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)",
                color: "#ff7070", padding: "12px", fontSize: "13px", marginBottom: "20px",
                letterSpacing: "0.5px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
              }}>
                {apiError}
              </div>
            )}

            <div className="rp-field">
              <label className="rp-label" htmlFor="rp-pw">New Password</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">◆</span>
                <input
                  id="rp-pw" type={showPw ? "text" : "password"} className="rp-input"
                  placeholder="At least 6 characters" value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  style={{ paddingRight: "60px" }}
                />
                <button type="button" className="rp-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? "Hide" : "Show"}
                </button>
                <div className="rp-input-line" />
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-label" htmlFor="rp-pw2">Confirm Password</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">◆</span>
                <input
                  id="rp-pw2" type={showPw ? "text" : "password"} className="rp-input"
                  placeholder="Retype password" value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                  style={{ paddingRight: "60px" }}
                />
                <div className="rp-input-line" />
              </div>
              {error && <div className="rp-error show">{error}</div>}
            </div>

            <button type="submit" className={cx("rp-submit", loading && "loading")}>
              <div className="rp-submit-inner">
                {loading ? <span style={{ letterSpacing: 4 }}>Processing...</span> : <span>Confirm Update</span>}
              </div>
            </button>
          </form>
        </>
      )}

      <div className="rp-back">
        <Link href="/login">← Cancel to Login</Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="rp-root">
      <div className="rp-scan" />
      <div className="rp-left">
        <Suspense fallback={<div style={{ color: "#fff" }}>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <div className="rp-right">
        <div className="rp-right-bg" />
        <img src={ANIME_IMG} alt="Techexotica" className="rp-anime-img rp-in" draggable={false} />
        <div className="rp-crt" />
        <div className="rp-img-fade-l" />
        <div className="rp-img-fade-t" />
        <div className="rp-img-fade-b" />
      </div>
    </div>
  );
}
