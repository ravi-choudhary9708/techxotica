"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Hackathon", href: "#hackathon" },
  { label: "Workshops", href: "#workshops" },
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(2, 4, 13, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,245,255,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-orbitron font-bold text-xl tracking-widest neon-text-cyan focus:outline-none"
        >
          TECH<span className="text-white">EXOTICA</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNavClick(l.href)}
              className="font-rajdhani text-sm tracking-widest uppercase text-slate-400 hover:text-[#00f5ff] transition-colors duration-200 focus:outline-none"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="btn-neon text-xs py-2 px-5"
          >
            Register
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-0.5 bg-[#00f5ff] transition-all duration-300"
              style={{
                opacity: i === 1 && menuOpen ? 0 : 1,
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(6px, 6px)"
                    : menuOpen && i === 2
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"}`}
        style={{ background: "rgba(2,4,13,0.97)", borderTop: "1px solid rgba(0,245,255,0.1)" }}
      >
        <div className="flex flex-col px-4 py-4 gap-4">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNavClick(l.href)}
              className="font-rajdhani text-sm tracking-widest uppercase text-slate-400 hover:text-[#00f5ff] transition-colors text-left focus:outline-none"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="btn-neon text-xs py-2 px-5 max-w-max"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
