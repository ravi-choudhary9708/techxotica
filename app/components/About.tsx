"use client";

const departments = [
  { icon: "⚙️", name: "Mechanical Engineering" },
  { icon: "💡", name: "Electrical Engineering" },
  { icon: "🏗️", name: "Civil Engineering" },
  { icon: "💻", name: "Computer Science & Engg." },
  { icon: "🔬", name: "Applied Science & Humanities" },
];

const stats = [
  { value: "2019", label: "Established" },
  { value: "240+", label: "Students / Year" },
  { value: "5", label: "Departments" },
  { value: "AICTE", label: "Approved" },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 80% 50%, rgba(168,85,247,0.05) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">Who Are We</p>
          <h2 className="section-title gradient-text">About GEC Madhubani</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="reveal">
            <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
              <span className="font-orbitron text-[#00f5ff] font-bold">Government Engineering College Madhubani</span> is a premier engineering institution established in{" "}
              <span className="text-white font-semibold">2019</span>, located in <span className="text-white">Madhubani, Bihar</span>.
              Affiliated with <strong className="text-slate-200">Bihar Engineering University (BEU)</strong> and approved by AICTE, the college is committed to producing world-class engineers.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              <strong className="text-[#a855f7]">Techexotica</strong> is GEC Madhubani's flagship annual technical festival — a celebration of engineering, innovation, and the limitless potential of tomorrow's builders.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass-card p-4 text-center"
                  style={{ border: "1px solid rgba(0,245,255,0.15)" }}
                >
                  <div className="font-orbitron font-black text-2xl neon-text-cyan mb-1">{value}</div>
                  <div className="font-rajdhani text-xs tracking-widest uppercase text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: departments */}
          <div className="reveal">
            <div
              className="animated-border p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="font-orbitron text-xs tracking-widest uppercase text-slate-400 mb-5">
                Departments
              </p>
              <div className="flex flex-col gap-3">
                {departments.map((dept) => (
                  <div
                    key={dept.name}
                    className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-[rgba(0,245,255,0.05)] group cursor-default"
                    style={{ border: "1px solid rgba(0,245,255,0.08)" }}
                  >
                    <span className="text-2xl">{dept.icon}</span>
                    <span className="font-rajdhani font-semibold text-slate-300 group-hover:text-[#00f5ff] transition-colors tracking-wide">
                      {dept.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Vision */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <p className="font-orbitron text-xs text-[#a855f7] tracking-widest mb-2">VISION</p>
                <p className="font-rajdhani text-slate-300 leading-relaxed">
                  To be a centre of excellence in technical education, producing globally competent engineers who drive innovation and socio-economic growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
