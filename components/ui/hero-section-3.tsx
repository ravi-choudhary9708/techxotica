"use client";

import React from "react";
import { Search, MessageSquare, Plus } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface HeroSectionProps {
  backgroundImage: string;
  logoText?: string;
  navLinks?: NavLink[];
  versionText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function HeroSection({
  backgroundImage,
  logoText = "GEC MADHUBANI",
  navLinks = [],
  versionText = "INFRASTRUCTURE & EXCELLENCE",
  title = "Experience Quality",
  subtitle = "Shaping the future of engineering in Bihar.",
  ctaText = "Know More",
}: HeroSectionProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <header className="absolute inset-x-0 top-0 p-6 md:p-8 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-3xl font-orbitron font-bold gradient-text">{logoText}</div>
          <nav className="hidden md:flex space-x-8 text-sm font-rajdhani tracking-widest uppercase">
            {navLinks?.map((link) => (
              <a key={link.href} href={link.href} className="text-white/70 hover:text-[#00f5ff] transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button type="button" aria-label="Search" className="text-white/70 hover:text-[#00f5ff]">
              <Search size={20} />
            </button>
            <button className="border border-[#00f5ff]/50 rounded-full px-6 py-2 text-sm font-rajdhani font-medium text-white hover:bg-[#00f5ff] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              Explore
            </button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto h-screen flex items-center px-6 md:px-8 z-10">
        <div className="w-full md:w-3/5 lg:w-1/2">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-tight mb-6 uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {title}
          </h1>
          <p className="text-lg md:text-xl font-rajdhani text-gray-300 max-w-lg mb-10 leading-relaxed">
            {subtitle}
          </p>
          <button className="bg-white text-black font-orbitron font-bold px-10 py-4 rounded-md hover:bg-[#00f5ff] transition-all duration-300 hover:scale-105 shadow-xl">
            {ctaText}
          </button>
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm font-rajdhani tracking-[0.3em] uppercase text-white/50">{versionText}</div>
          <button type="button" aria-label="Chat" className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full h-14 w-14 flex items-center justify-center hover:bg-[#a855f7]/20 hover:border-[#a855f7]/40 transition-all duration-300 group">
            <MessageSquare size={24} className="group-hover:text-[#a855f7] transition-colors" />
          </button>
        </div>
      </footer>
    </div>
  );
}

// No PropTypes needed as we are using TypeScript interfaces now.
