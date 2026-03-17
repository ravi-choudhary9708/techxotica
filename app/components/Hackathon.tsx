"use client";

const perks = [
  { icon: "⏱️", text: "24-Hour Non-Stop Challenge" },
  { icon: "👥", text: "Teams of 2–4 Members" },
  { icon: "🍕", text: "Food & Refreshments Provided" },
  { icon: "🏆", text: "Mentorship from Industry Experts" },
  { icon: "🎁", text: "Swag Kits for All Participants" },
  { icon: "🌐", text: "Open to All Engineering Students" },
];

const tracks = [
  { name: "AI & Machine Learning", icon: "🧠", color: "#a855f7" },
  { name: "Web & Mobile Dev", icon: "📱", color: "#00f5ff" },
  { name: "IoT & Embedded Systems", icon: "📡", color: "#ffd700" },
  { name: "Cybersecurity", icon: "🔐", color: "#ec4899" },
  { name: "Open Innovation", icon: "🚀", color: "#00ff88" },
];

export default function Hackathon() {
  const scrollToContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hackathon"
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* BG Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.07) 0%, transparent 65%)" }} />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#a855f7] mb-2">Flagship Event</p>
          <h2 className="section-title" style={{ color: "#a855f7", textShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
            HACKATHON
          </h2>
          <div className="section-divider" style={{ ["--neon-cyan" as string]: "#a855f7" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
          </div>
          <p className="section-subtitle">24 Hours · Team Challenge · ₹25,000 Prize Pool</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Big prize card */}
          <div className="reveal">
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(0,245,255,0.05) 100%)",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              {/* Glow blob */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

              <div className="relative z-10">
                <span className="font-orbitron text-xs tracking-widest uppercase text-[#a855f7] mb-4 block">Grand Prize</span>
                <div className="font-orbitron font-black text-6xl text-white mb-1">₹25K</div>
                <p className="text-slate-400 text-sm mb-8">+ Certificates, Goodies &amp; Internship Opportunities</p>

                {/* Prize tiers */}
                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { place: "1st", prize: "₹15,000", color: "#ffd700" },
                    { place: "2nd", prize: "₹7,000", color: "#a0aec0" },
                    { place: "3rd", prize: "₹3,000", color: "#c97e3e" },
                  ].map(({ place, prize, color }) => (
                    <div
                      key={place}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: `rgba(${hexToRgb(color)},0.07)`, border: `1px solid rgba(${hexToRgb(color)},0.2)` }}
                    >
                      <span className="font-orbitron text-sm font-bold" style={{ color }}>{place} Place</span>
                      <span className="font-orbitron text-lg font-black" style={{ color }}>{prize}</span>
                    </div>
                  ))}
                </div>

                <button onClick={scrollToContact} className="btn-neon-solid w-full justify-center py-3"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                  Register Team
                </button>
              </div>
            </div>
          </div>

          {/* Right: Tracks + Perks */}
          <div className="reveal flex flex-col gap-6">
            {/* Tracks */}
            <div>
              <p className="font-orbitron text-xs tracking-widest uppercase text-slate-400 mb-3">Problem Tracks</p>
              <div className="flex flex-col gap-2">
                {tracks.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-default"
                    style={{ background: `rgba(${hexToRgb(t.color)},0.06)`, border: `1px solid rgba(${hexToRgb(t.color)},0.15)` }}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-rajdhani font-semibold tracking-wide" style={{ color: t.color }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div>
              <p className="font-orbitron text-xs tracking-widest uppercase text-slate-400 mb-3">What You Get</p>
              <div className="grid grid-cols-2 gap-2">
                {perks.map((p) => (
                  <div
                    key={p.text}
                    className="flex items-start gap-2 p-3 rounded-xl text-sm text-slate-300"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span>{p.icon}</span>
                    <span className="font-rajdhani leading-snug">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
