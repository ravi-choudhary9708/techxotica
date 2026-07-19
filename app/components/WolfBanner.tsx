"use client";

import { useEffect, useRef, useState } from "react";

export default function WolfBanner() {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: "clamp(220px, 35vh, 420px)" }}>
      <style>{`
        @keyframes wbZoom {
          0%,100% { transform: scale(1.03); }
          50%      { transform: scale(1.07); }
        }
        @keyframes wbFade {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wb-img  { animation: wbZoom 18s ease-in-out infinite; will-change: transform; }
        .wb-fade { animation: wbFade 0.9s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* Wolf image */}
      <div
        className="wb-img absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wolf.png')", backgroundPosition: "center 25%" }}
      />

      {/* Clean fades top + bottom into site bg — no vignette mess */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #02040d 0%, transparent 28%, transparent 72%, #02040d 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(2,4,13,0.55) 0%, transparent 25%, transparent 75%, rgba(2,4,13,0.55) 100%)" }} />


    </div>
  );
}
