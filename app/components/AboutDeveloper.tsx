"use client";

export default function AboutDeveloper() {
  return (
    <section
      id="developer"
      className="relative py-28"
      style={{
        borderTop: "1px solid rgba(168,85,247,0.12)",
      }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(168,85,247,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        {/* Label */}
        <p
          className="font-rajdhani text-xs tracking-[0.4em] uppercase"
          style={{ color: "#a855f7" }}
        >
          Developed By
        </p>
        {/* Name */}
        <h3
          className="font-orbitron font-black text-white"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            letterSpacing: "0.1em",
            textShadow: "0 0 20px rgba(168,85,247,0.5)",
          }}
        >
          CSE{" "}
          <span
            style={{
              color: "#a855f7",
              textShadow: "0 0 15px #a855f7, 0 0 40px rgba(168,85,247,0.4)",
            }}
          >
            IOT - 2024
          </span>
        </h3>

        {/* Subtitle */}
        <p
          className="font-rajdhani text-xs tracking-[0.3em] uppercase"
          style={{ color: "#475569" }}
        >
          IOT · GEC Madhubani · Batch 2024
        </p>

        {/* Social icons */}
        <div className="flex gap-4 mt-2">
          {/* GitHub */}
          <a
            href="https://github.com/ravi-choudhary9708"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-icon-link"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#a855f7";
              (e.currentTarget as HTMLAnchorElement).style.filter = "drop-shadow(0 0 8px #a855f7)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#64748b";
              (e.currentTarget as HTMLAnchorElement).style.filter = "none";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="22"
              height="22"
              style={{ transition: "all 0.3s ease" }}
            >
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.235-3.221-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.12 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.805 5.628-5.476 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/ravi-choudhary9708"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#a855f7";
              (e.currentTarget as HTMLAnchorElement).style.filter = "drop-shadow(0 0 8px #a855f7)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#64748b";
              (e.currentTarget as HTMLAnchorElement).style.filter = "none";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="22"
              height="22"
              style={{ transition: "all 0.3s ease" }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
