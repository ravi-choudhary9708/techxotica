"use client";

export default function Footer() {
  return (
    <footer
      className="relative py-12 px-4 overflow-hidden"
      style={{
        background: "rgba(2,4,13,0.98)",
        borderTop: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(0,245,255,0.03) 0%, transparent 60%)"
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="font-orbitron font-black text-2xl tracking-widest neon-text-cyan mb-3">
              TECH<span className="text-white">EXOTICA</span>
            </div>
            <p className="text-slate-500 font-rajdhani text-sm leading-relaxed">
              The annual technical festival of Government Engineering College Madhubani — where innovation meets excellence.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-orbitron text-xs tracking-widest uppercase text-slate-400 mb-4">Quick Links</p>
            <div className="flex flex-col gap-2">
              {["About", "Events", "Hackathon", "Workshops", "Schedule"].map((l) => (
                <button
                  key={l}
                  onClick={() => document.querySelector(`#${l.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-left font-rajdhani text-sm text-slate-500 hover:text-[#00f5ff] transition-colors focus:outline-none w-max"
                >
                  → {l}
                </button>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <p className="font-orbitron text-xs tracking-widest uppercase text-slate-400 mb-4">Organized By</p>
            <p className="text-slate-300 font-rajdhani text-base font-semibold leading-snug">
              Government Engineering College<br />Madhubani, Bihar
            </p>
            <p className="text-slate-500 font-rajdhani text-sm mt-2">
              Affiliated with Bihar Engineering University (BEU)<br />
              Approved by AICTE
            </p>
            <div className="mt-4 inline-flex items-center gap-2 font-rajdhani text-xs text-[#00f5ff] px-3 py-1.5 rounded-full"
              style={{ border: "1px solid rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.05)" }}>
              <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
              April 18–19, 2026
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-rajdhani text-xs text-slate-600 tracking-widest">
            © 2026 Techexotica · GEC Madhubani · All Rights Reserved
          </p>
          <p className="font-rajdhani text-xs text-slate-700 tracking-widest">
            Built with ❤️ by the Tech Committee, GEC Madhubani
          </p>
        </div>
      </div>
    </footer>
  );
}
