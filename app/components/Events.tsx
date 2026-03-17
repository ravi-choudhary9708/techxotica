"use client";

const events = [
  {
    icon: "🤖",
    category: "Robotics",
    title: "Robo Race",
    desc: "Build an autonomous robot and race it through a challenging obstacle course. Speed, agility and engineering wit to win.",
    prize: "₹15,000",
    tag: "Hardware",
    color: "#00f5ff",
  },
  {
    icon: "💻",
    category: "Programming",
    title: "Code Wars",
    desc: "A high-intensity competitive programming contest. Solve complex algorithmic challenges faster than your rivals.",
    prize: "₹12,000",
    tag: "Software",
    color: "#a855f7",
  },
  {
    icon: "⚡",
    category: "Electronics",
    title: "Circuit Quest",
    desc: "Design and debug circuit boards under time pressure. Test your knowledge of electronics and signal processing.",
    prize: "₹10,000",
    tag: "Electronics",
    color: "#ffd700",
  },
  {
    icon: "💡",
    category: "Innovation",
    title: "Idea Forge",
    desc: "Present your startup idea to a panel of industry mentors. Build a pitch that could change Bihar's tech landscape.",
    prize: "₹8,000",
    tag: "Business",
    color: "#00ff88",
  },
  {
    icon: "🧠",
    category: "Quiz",
    title: "TechQuiz Arena",
    desc: "A knock-out quiz covering engineering, science, current technology and general aptitude. Be the last one standing.",
    prize: "₹6,000",
    tag: "Knowledge",
    color: "#ec4899",
  },
  {
    icon: "📄",
    category: "Research",
    title: "Paper Presentation",
    desc: "Present your original research or technical paper to a jury of professors and industry professionals.",
    prize: "₹8,000",
    tag: "Academic",
    color: "#f97316",
  },
  {
    icon: "🎨",
    category: "Design",
    title: "CAD Challenge",
    desc: "Create stunning mechanical and structural designs using CAD software within a fixed time limit.",
    prize: "₹5,000",
    tag: "Design",
    color: "#06b6d4",
  },
  {
    icon: "🔋",
    category: "Energy",
    title: "Green Tech Expo",
    desc: "Showcase sustainable energy innovations and eco-friendly engineering projects for a better tomorrow.",
    prize: "₹7,000",
    tag: "Sustainability",
    color: "#84cc16",
  },
  {
    icon: "🚀",
    category: "Aerospace",
    title: "Rocket Launch",
    desc: "Design and launch model rockets. Accuracy, altitude and safety scoring criteria decide the winner.",
    prize: "₹9,000",
    tag: "Aerospace",
    color: "#a855f7",
  },
];

export default function Events() {
  return (
    <section
      id="events"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 60%, rgba(0,245,255,0.04) 0%, transparent 55%)",
      }}
    >
      {/* Decorative hex lines */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">What Awaits You</p>
          <h2 className="section-title gradient-text">Events &amp; Competitions</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
          <p className="section-subtitle">
            20+ events across technical, creative &amp; entrepreneurial domains
          </p>
        </div>

        {/* Events grid */}
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.title}
              className="glass-card p-6 reveal group cursor-pointer"
              style={{ border: `1px solid rgba(${hexToRgb(event.color)}, 0.12)` }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `rgba(${hexToRgb(event.color)}, 0.1)`, border: `1px solid rgba(${hexToRgb(event.color)}, 0.2)` }}
                >
                  {event.icon}
                </div>
                <span
                  className="font-rajdhani text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{
                    color: event.color,
                    background: `rgba(${hexToRgb(event.color)}, 0.1)`,
                    border: `1px solid rgba(${hexToRgb(event.color)}, 0.25)`,
                  }}
                >
                  {event.tag}
                </span>
              </div>

              {/* Category */}
              <p
                className="font-rajdhani text-xs tracking-widest uppercase mb-1"
                style={{ color: event.color, opacity: 0.7 }}
              >
                {event.category}
              </p>

              {/* Title */}
              <h3
                className="font-orbitron font-bold text-xl text-white mb-3 group-hover:text-[#00f5ff] transition-colors duration-300"
              >
                {event.title}
              </h3>

              {/* Desc */}
              <p className="text-slate-400 text-sm leading-relaxed mb-5 font-light">
                {event.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <span className="font-rajdhani text-xs uppercase tracking-widest text-slate-500">Prize</span>
                  <p className="font-orbitron font-bold text-lg" style={{ color: event.color }}>{event.prize}</p>
                </div>
                <button
                  className="font-rajdhani text-xs tracking-widest uppercase py-2 px-4 rounded-lg transition-all duration-300"
                  style={{
                    color: event.color,
                    border: `1px solid rgba(${hexToRgb(event.color)}, 0.3)`,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `rgba(${hexToRgb(event.color)}, 0.15)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  Know More →
                </button>
              </div>
            </div>
          ))}
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
