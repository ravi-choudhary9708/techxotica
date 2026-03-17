"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Who can participate in Techexotica?",
    a: "All students enrolled in any engineering college across India are eligible to participate. Some events are also open to Diploma and B.Sc. students.",
  },
  {
    q: "Is there a registration fee?",
    a: "Event registrations are free for GEC Madhubani students. External participants may have a nominal fee of ₹100–₹200 per event. Workshops may carry separate fees.",
  },
  {
    q: "Can I participate in multiple events?",
    a: "Yes! You can register for as many events as you wish, subject to schedule conflicts. We recommend planning ahead using the schedule section.",
  },
  {
    q: "Will accommodation be provided?",
    a: "Outstation participants can request accommodation through the registration form. We will try our best to facilitate hostel accommodation within the campus.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    college: "", 
    email: "", 
    phone: "", 
    event: "", 
    year: "",
    dept: "",
    message: "" 
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    background: "rgba(2, 4, 13, 0.6)",
    border: "1px solid rgba(0,245,255,0.2)",
    color: "#fff",
    borderRadius: "12px",
    padding: "14px 18px",
    width: "100%",
    outline: "none",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "1rem",
    letterSpacing: "0.05em",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  return (
    <section id="contact" className="story-section">
      {/* Background glow */}
      <div className="story-bg-base bg-gradient-to-bl from-[#00f5ff]/10 to-transparent" />
      
      <div className="story-container">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">Join The Festival</p>
          <h2 className="section-title gradient-text">Register &amp; Contact</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div className="reveal">
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center h-full p-10 rounded-2xl text-center"
                style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.2)" }}
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-orbitron font-bold text-xl neon-text-cyan mb-2">You&apos;re Registered!</h3>
                <p className="text-slate-400 font-rajdhani text-base">
                  We&apos;ll send confirmation details to <span className="text-white">{form.email}</span>. See you at Techexotica 2026!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-orbitron text-lg text-white mb-2">Registration Form</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Full Name *</label>
                    <input
                      required name="name" value={form.name} onChange={handleChange}
                      placeholder="Your Name"
                      style={inputStyle}
                      className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    />
                  </div>
                  <div>
                    <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Phone *</label>
                    <input
                      required name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 XXXXXXXXXX" type="tel"
                      style={inputStyle}
                      className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Department *</label>
                    <input
                      required name="dept" value={form.dept} onChange={handleChange}
                      placeholder="Ex: CSE, ECE, ME"
                      style={inputStyle}
                      className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    />
                  </div>
                  <div>
                    <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Year of Study *</label>
                    <select
                      required name="year" value={form.year} onChange={handleChange}
                      style={{ ...inputStyle, appearance: "none" as const }}
                      className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    >
                      <option value="" style={{ background: "#02040d" }}>Select Year</option>
                      {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
                        <option key={y} value={y} style={{ background: "#02040d" }}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Email *</label>
                  <input
                    required name="email" value={form.email} onChange={handleChange}
                    placeholder="you@college.ac.in" type="email"
                    style={inputStyle}
                    className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                  />
                </div>

                <div>
                  <label className="font-rajdhani text-xs tracking-widest uppercase text-slate-500 mb-1 block">College Name *</label>
                  <input
                    required name="college" value={form.college} onChange={handleChange}
                    placeholder="Government Engineering College Madhubani"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.15)")}
                  />
                </div>

                <div>
                  <label className="font-rajdhani text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-1.5 block ml-1">Interested Event</label>
                  <select
                    name="event" value={form.event} onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none" as const }}
                    className="focus:border-[#00f5ff] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                  >
                    <option value="" style={{ background: "#02040d" }}>Select an Event</option>
                    {["Hackathon", "Robo Race", "Code Wars", "Circuit Quest", "Idea Forge", "TechQuiz Arena", "Paper Presentation", "CAD Challenge", "Workshop — AI/ML", "Workshop — Ethical Hacking", "Workshop — Robotics"].map(ev => (
                      <option key={ev} value={ev} style={{ background: "#02040d" }}>{ev}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-rajdhani text-xs tracking-widest uppercase text-slate-500 mb-1 block">Message (optional)</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Any queries or special requirements..."
                    rows={3}
                    style={{ ...inputStyle, resize: "none" as const }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.15)")}
                  />
                </div>

                <button type="submit" id="register-submit" className="btn-neon-solid py-3 justify-center mt-2 text-sm">
                  Submit Registration →
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Info + FAQ */}
          <div className="reveal flex flex-col gap-8">
            {/* Contact Info */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,245,255,0.1)" }}
            >
              <h3 className="font-orbitron text-sm tracking-widest uppercase text-[#00f5ff] mb-5">Contact Info</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "📍", label: "Address", value: "GEC Madhubani, Madhubani, Bihar — 847211" },
                  { icon: "✉️", label: "Email", value: "techexotica@gecmadhubani.ac.in" },
                  { icon: "📞", label: "Phone", value: "+91 XXXXX XXXXX" },
                  { icon: "🌐", label: "Website", value: "www.gecmadhubani.ac.in" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-xl w-8 flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-rajdhani text-xs tracking-widest uppercase text-slate-500">{label}</p>
                      <p className="text-slate-300 font-rajdhani text-base">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {["Instagram", "LinkedIn", "Twitter/X", "YouTube"].map((s) => (
                  <button
                    key={s}
                    id={`social-${s.toLowerCase().replace(/\//g, "-")}`}
                    className="font-rajdhani text-xs tracking-widest px-3 py-2 rounded-lg transition-all duration-200"
                    style={{ border: "1px solid rgba(0,245,255,0.15)", color: "#64748b" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; e.currentTarget.style.color = "#00f5ff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.15)"; e.currentTarget.style.color = "#64748b"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-orbitron text-sm tracking-widest uppercase text-[#a855f7] mb-4">FAQs</h3>
              <div className="flex flex-col gap-2">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                  >
                    <button
                      id={`faq-${i}`}
                      className="w-full text-left p-4 font-rajdhani font-semibold text-slate-200 flex justify-between items-center focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#00f5ff] ml-2 transition-transform duration-300" style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-slate-400 font-rajdhani text-sm leading-relaxed" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        {faq.a}
                      </div>
                    )}
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
