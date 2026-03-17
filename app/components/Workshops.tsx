"use client";

const workshops = [
  {
    icon: "🧬",
    title: "AI & Machine Learning",
    instructor: "Industry Expert · Online + Offline",
    duration: "4 Hours",
    level: "Intermediate",
    desc: "Hands-on session on supervised learning, neural networks, and deploying ML models using Python and TensorFlow.",
    color: "#a855f7",
    seats: 60,
  },
  {
    icon: "🔐",
    title: "Ethical Hacking",
    instructor: "CEH Certified Professional",
    duration: "3 Hours",
    level: "Beginner–Mid",
    desc: "Learn penetration testing, web vulnerability scanning, and ethical hacking techniques using Kali Linux.",
    color: "#ec4899",
    seats: 40,
  },
  {
    icon: "🤖",
    title: "Robotics & Arduino",
    instructor: "Robotics Club, GEC Madhubani",
    duration: "4 Hours",
    level: "Beginner",
    desc: "Build and program your first Arduino-based robot from scratch. Components provided. Great for absolute beginners.",
    color: "#00f5ff",
    seats: 30,
  },
  {
    icon: "🌐",
    title: "Full-Stack Web Dev",
    instructor: "MERN Stack Developer",
    duration: "5 Hours",
    level: "Beginner–Mid",
    desc: "Build a real-world web app using React, Node.js, Express and MongoDB. Take home a deployed project.",
    color: "#00ff88",
    seats: 50,
  },
  {
    icon: "📡",
    title: "IoT Fundamentals",
    instructor: "IoT & Embedded Systems Lead",
    duration: "3 Hours",
    level: "Beginner",
    desc: "Connect sensors, actuators and microcontrollers to build live IoT dashboards. ESP32 kits provided.",
    color: "#ffd700",
    seats: 35,
  },
  {
    icon: "☁️",
    title: "Cloud Computing & AWS",
    instructor: "AWS Certified Solutions Architect",
    duration: "3 Hours",
    level: "All Levels",
    desc: "Deploy, scale, and manage applications on AWS. Hands-on labs using EC2, S3, Lambda, and CloudFormation.",
    color: "#f97316",
    seats: 45,
  },
];

const levelColors: Record<string, string> = {
  "Beginner": "#00ff88",
  "Intermediate": "#ffd700",
  "Beginner–Mid": "#00f5ff",
  "All Levels": "#a855f7",
};

export default function Workshops() {
  return (
    <section
      id="workshops"
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(0,255,136,0.04) 0%, transparent 55%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00ff88] mb-2">Learn By Doing</p>
          <h2 className="section-title" style={{ color: "#fff" }}>
            <span style={{ color: "#00ff88", textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>Workshop</span> Sessions
          </h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
          </div>
          <p className="section-subtitle">Expert-led, hands-on workshops with take-home projects</p>
        </div>

        {/* Workshop cards */}
        <div className="events-grid">
          {workshops.map((ws) => (
            <div
              key={ws.title}
              className="glass-card p-6 reveal flex flex-col"
              style={{ border: `1px solid rgba(${hexToRgb(ws.color)},0.15)` }}
            >
              {/* Icon + Level */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `rgba(${hexToRgb(ws.color)},0.1)`, border: `1px solid rgba(${hexToRgb(ws.color)},0.2)` }}
                >
                  {ws.icon}
                </div>
                <span
                  className="font-rajdhani text-xs tracking-widest px-3 py-1 rounded-full"
                  style={{
                    color: levelColors[ws.level] || ws.color,
                    background: `rgba(${hexToRgb(levelColors[ws.level] || ws.color)},0.1)`,
                    border: `1px solid rgba(${hexToRgb(levelColors[ws.level] || ws.color)},0.25)`,
                  }}
                >
                  {ws.level}
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-lg text-white mb-1">{ws.title}</h3>
              <p className="font-rajdhani text-xs tracking-widest text-slate-500 mb-3 uppercase">{ws.instructor}</p>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-4">{ws.desc}</p>

              {/* Duration + Seats */}
              <div className="flex items-center justify-between text-xs pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span>⏱</span>
                    <span className="font-rajdhani tracking-wide">{ws.duration}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span>👥</span>
                    <span className="font-rajdhani tracking-wide">{ws.seats} Seats</span>
                  </span>
                </div>
                <button
                  className="font-rajdhani text-xs tracking-widest uppercase py-1.5 px-3 rounded-lg transition-all duration-300"
                  style={{ color: ws.color, border: `1px solid rgba(${hexToRgb(ws.color)},0.3)` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `rgba(${hexToRgb(ws.color)},0.1)`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Register →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Note */}
        <div className="text-center mt-12 reveal">
          <p className="text-slate-500 text-sm font-rajdhani tracking-wide">
            Workshop registrations are separate from event registrations. Limited seats — register early.
          </p>
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
