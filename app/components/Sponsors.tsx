"use client";

const tiers = [
  {
    tier: "Title Sponsor",
    sponsors: ["Your Brand Here"],
    size: "text-2xl",
    opacity: "opacity-100",
    color: "#ffd700",
  },
  {
    tier: "Powered By",
    sponsors: ["TechPartner A", "TechPartner B"],
    size: "text-xl",
    opacity: "opacity-90",
    color: "#00f5ff",
  },
  {
    tier: "Associate Sponsors",
    sponsors: ["Brand A", "Brand B", "Brand C", "Brand D"],
    size: "text-base",
    opacity: "opacity-75",
    color: "#a855f7",
  },
  {
    tier: "Community Partners",
    sponsors: ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5"],
    size: "text-sm",
    opacity: "opacity-60",
    color: "#64748b",
  },
];

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.04) 0%, transparent 55%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#ffd700] mb-2">Our Partners</p>
          <h2 className="section-title text-white">
            Sponsors &amp; <span className="neon-text-gold">Partners</span>
          </h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full" style={{ background: "#ffd700", boxShadow: "0 0 8px #ffd700" }} />
          </div>
          <p className="section-subtitle">Backed by industry leaders driving innovation</p>
        </div>

        {/* Sponsor tiers */}
        <div className="flex flex-col gap-12">
          {tiers.map((tier) => (
            <div key={tier.tier} className="reveal text-center">
              <p className="font-orbitron text-xs tracking-widest uppercase mb-6" style={{ color: tier.color }}>
                — {tier.tier} —
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {tier.sponsors.map((name) => (
                  <div
                    key={name}
                    className={`glass-card px-8 py-6 ${tier.size} ${tier.opacity} font-orbitron font-bold tracking-widest cursor-default`}
                    style={{
                      color: tier.color,
                      border: `1px solid rgba(${hexToRgb(tier.color)},0.2)`,
                      minWidth: "160px",
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to become sponsor */}
        <div
          className="mt-16 p-8 rounded-2xl text-center reveal"
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(0,245,255,0.03) 100%)",
            border: "1px solid rgba(255,215,0,0.15)",
          }}
        >
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">Become a Sponsor</h3>
          <p className="text-slate-400 font-rajdhani mb-6 text-base">
            Partner with Techexotica to reach 1000+ engineering students and future tech leaders across Bihar.
          </p>
          <a
            href="mailto:techexotica@gecmadhubani.ac.in"
            className="btn-neon-solid py-3 px-10"
            style={{ background: "linear-gradient(135deg, #ffd700, #f97316)", color: "#000" }}
          >
            Contact Us
          </a>
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
