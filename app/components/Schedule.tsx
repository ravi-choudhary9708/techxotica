"use client";

const schedule = [
  {
    day: "Day 1",
    date: "April 18, 2026",
    color: "#00f5ff",
    events: [
      { time: "08:00 AM", title: "Registration & Check-in", type: "General" },
      { time: "09:30 AM", title: "Inaugural Ceremony", type: "Ceremony" },
      { time: "10:30 AM", title: "Hackathon Kickoff", type: "Hackathon" },
      { time: "11:00 AM", title: "Workshop: AI & Machine Learning", type: "Workshop" },
      { time: "12:30 PM", title: "Robo Race — Qualifiers", type: "Competition" },
      { time: "02:00 PM", title: "Code Wars — Round 1", type: "Competition" },
      { time: "02:30 PM", title: "Workshop: Ethical Hacking", type: "Workshop" },
      { time: "04:00 PM", title: "Circuit Quest", type: "Competition" },
      { time: "05:30 PM", title: "Paper Presentation — Session 1", type: "Competition" },
      { time: "07:00 PM", title: "Cultural Night & Networking", type: "Social" },
    ],
  },
  {
    day: "Day 2",
    date: "April 19, 2026",
    color: "#a855f7",
    events: [
      { time: "08:00 AM", title: "Hackathon Continues (Overnight)", type: "Hackathon" },
      { time: "09:00 AM", title: "Workshop: Robotics & Arduino", type: "Workshop" },
      { time: "10:00 AM", title: "Robo Race — Finals", type: "Competition" },
      { time: "10:30 AM", title: "Hackathon Submission Deadline", type: "Hackathon" },
      { time: "11:00 AM", title: "TechQuiz Arena", type: "Competition" },
      { time: "12:00 PM", title: "Idea Forge — Pitching Round", type: "Competition" },
      { time: "01:00 PM", title: "Workshop: Full-Stack Web Dev", type: "Workshop" },
      { time: "02:30 PM", title: "Code Wars — Finals", type: "Competition" },
      { time: "04:00 PM", title: "Hackathon — Project Presentations", type: "Hackathon" },
      { time: "05:30 PM", title: "Valedictory & Prize Distribution", type: "Ceremony" },
    ],
  },
];

const typeColors: Record<string, string> = {
  General: "#64748b",
  Ceremony: "#ffd700",
  Hackathon: "#a855f7",
  Workshop: "#00ff88",
  Competition: "#00f5ff",
  Social: "#ec4899",
};

export default function Schedule() {
  return (
    <section id="schedule" className="story-section">
      {/* Background glow */}
      <div className="story-bg-base bg-gradient-to-t from-[#00f5ff]/10 to-transparent" />
      
      <div className="story-container">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">Plan Your Visit</p>
          <h2 className="section-title gradient-text">Event Schedule</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
          <p className="section-subtitle">Two packed days of innovation and competition</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 reveal">
          {Object.entries(typeColors).map(([type, color]) => (
            <span
              key={type}
              className="flex items-center gap-2 font-rajdhani text-xs tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ color, background: `rgba(${hexToRgb(color)},0.1)`, border: `1px solid rgba(${hexToRgb(color)},0.25)` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((day) => (
            <div key={day.day} className="reveal">
              {/* Day header */}
              <div
                className="flex items-center justify-between p-4 rounded-xl mb-4"
                style={{
                  background: `rgba(${hexToRgb(day.color)},0.08)`,
                  border: `1px solid rgba(${hexToRgb(day.color)},0.3)`,
                }}
              >
                <div>
                  <span className="font-orbitron font-black text-xl" style={{ color: day.color }}>{day.day}</span>
                  <p className="font-rajdhani text-xs tracking-widest text-slate-400 mt-0.5">{day.date}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold"
                  style={{ background: `rgba(${hexToRgb(day.color)},0.15)`, color: day.color, border: `1px solid rgba(${hexToRgb(day.color)},0.3)` }}>
                  {day.day === "Day 1" ? "1" : "2"}
                </div>
              </div>

              {/* Timeline items */}
              <div className="flex flex-col gap-1 pl-2">
                {day.events.map((ev, idx) => {
                  const tc = typeColors[ev.type] || "#64748b";
                  return (
                    <div
                      key={idx}
                      className="flex gap-3 items-stretch group hover:bg-[rgba(255,255,255,0.02)] rounded-lg px-2 py-2 transition-all duration-200 cursor-default"
                    >
                      {/* Dot + line */}
                      <div className="flex flex-col items-center" style={{ minWidth: 12 }}>
                        <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: tc, boxShadow: `0 0 6px ${tc}` }} />
                        {idx < day.events.length - 1 && (
                          <div className="w-px flex-grow mt-1" style={{ background: `rgba(${hexToRgb(day.color)},0.15)` }} />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-grow min-w-0 pb-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-rajdhani font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors">{ev.title}</p>
                          <span className="font-rajdhani text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color: tc, background: `rgba(${hexToRgb(tc)},0.1)` }}>
                            {ev.type}
                          </span>
                        </div>
                        <p className="font-orbitron text-xs mt-0.5" style={{ color: day.color, opacity: 0.7 }}>{ev.time}</p>
                      </div>
                    </div>
                  );
                })}
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
