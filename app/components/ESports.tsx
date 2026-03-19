"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Swords, Trophy, Users, Zap, Terminal } from "lucide-react";

// Using the local warrior image for performance and to avoid token limit issues
const NINJA_IMG = "/warrior.png";

const ScanLine = () => (
  <motion.div
    initial={{ top: "-10%" }}
    animate={{ top: "110%" }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    className="absolute left-0 w-full h-[2px] bg-sky-400/20 z-10 pointer-events-none shadow-[0_0_15px_rgba(74,240,255,0.3)]"
  />
);

// Pre-seeded particle data — stable across server + client renders (no Math.random in render)
const PARTICLE_DATA = [
  { left: 89.6,  top: 50.3,  duration: 8.1 },
  { left: 4.97,  top: 63.7,  duration: 6.4 },
  { left: 29.0,  top: 97.9,  duration: 9.2 },
  { left: 11.9,  top: 22.2,  duration: 7.5 },
  { left: 73.3,  top: 15.1,  duration: 5.8 },
  { left: 78.2,  top: 23.8,  duration: 8.7 },
  { left: 93.5,  top: 34.7,  duration: 6.2 },
  { left: 38.4,  top: 92.6,  duration: 9.5 },
  { left: 49.1,  top: 91.8,  duration: 7.1 },
  { left: 82.1,  top: 61.4,  duration: 5.6 },
  { left: 56.0,  top: 60.4,  duration: 8.3 },
  { left: 41.0,  top: 74.8,  duration: 6.9 },
  { left: 44.2,  top: 3.29,  duration: 9.1 },
  { left: 47.7,  top: 71.9,  duration: 7.4 },
  { left: 47.5,  top: 29.3,  duration: 5.3 },
  { left: 8.05,  top: 88.0,  duration: 8.8 },
  { left: 60.6,  top: 0.43,  duration: 6.7 },
  { left: 1.50,  top: 79.7,  duration: 9.4 },
  { left: 92.8,  top: 34.4,  duration: 7.8 },
  { left: 8.25,  top: 74.2,  duration: 6.1 },
];

const FloatingParticle = ({ delay = 0, left = 50, top = 50, duration = 7 }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{
      y: [-20, 20, -20],
      opacity: [0, 0.3, 0],
      scale: [0.8, 1.2, 0.8]
    }}
    transition={{ duration, repeat: Infinity, delay }}
    className="absolute w-1 h-1 bg-white rounded-full bg-glow"
    style={{ left: `${left}%`, top: `${top}%` }}
  />
);

const ESports = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="esports"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden py-48 px-6 md:px-12 flex flex-col items-center justify-center font-['Rajdhani']"
    >
      {/* Background Texture & Grain */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #111 25%, transparent 25%), 
            linear-gradient(-45deg, #111 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #111 75%), 
            linear-gradient(-45deg, transparent 75%, #111 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none noise-bg" />

      {/* Ambient Lights */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full" />

      {/* Floating Particles — stable positions, no Math.random in render */}
      {PARTICLE_DATA.map((p, i) => (
        <FloatingParticle key={i} delay={i * 0.2} left={p.left} top={p.top} duration={p.duration} />
      ))}

      <ScanLine />

      <div className="w-full max-w-7xl relative z-10 flex flex-col">
        {/* Header Section */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <div className="relative inline-block">
              <motion.h2
                className="text-6xl md:text-8xl font-black text-[#f0f0f0] tracking-tighter uppercase italic"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ESports <span className="text-[#4af0ff]">Arena</span>
              </motion.h2>

              {/* Slash Animation Underline */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-1 bg-gradient-to-r from-[#4af0ff] via-transparent to-transparent mt-2"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="h-[1px] bg-white/30 mt-1 ml-4"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-silver-400 text-lg md:text-xl font-medium tracking-widest mt-4 flex items-center gap-3 text-[#c0c0c0]"
            >
              <Terminal className="w-5 h-5 text-[#4af0ff]" />
              ESTABLISHED PROTOCOL: DOMINATION_V1.0
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Stats & Info */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'GAMES', value: 'BGMI / Free Fire', icon: Gamepad2 },
                { label: 'STATUS', value: 'LIVE', icon: Zap },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 1 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="bg-white/5 border border-white/10 p-6 relative overflow-hidden group backdrop-blur-sm"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%)' }}
                >
                  <stat.icon className="w-5 h-5 text-[#4af0ff] mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-[#c0c0c0] tracking-tighter uppercase">{stat.label}</div>
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-sky-400/5 rotate-45 transform translate-x-4 translate-y-[-20px]" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="p-8 border-l-2 border-[#4af0ff] bg-gradient-to-r from-[#4af0ff]/5 to-transparent"
            >
              <h3 className="text-2xl font-bold text-white mb-4 italic flex items-center gap-2">
                <Swords className="text-[#4af0ff]" /> THE ULTIMATE SHOWDOWN
              </h3>
              <p className="text-[#c0c0c0] leading-relaxed text-lg">
                Step into the high-stakes arena where skill meets strategy. From the tactical precision of Valorant
                to the raw battle royale chaos of BGMI, only the strongest survive. Are you ready to etch
                your name in the hall of champions?
              </p>
              <motion.button
                whileHover={{ scale: 1.05, letterSpacing: "2px" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/events'}
                className="mt-8 px-10 py-4 bg-[#f0f0f0] text-[#0a0a0a] font-bold uppercase tracking-wider skew-x-[-12deg] hover:bg-[#4af0ff] transition-all relative group overflow-hidden"
              >
                <span className="relative z-10">Register Now</span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side: Ninja Character Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2"
          >
            {/* Decorative Frames */}
            <div className="absolute inset-0 border-[1px] border-white/10 -m-4 skew-y-3" />
            <div className="absolute inset-0 border-[1px] border-[#4af0ff]/20 m-2 -skew-y-3" />

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#4af0ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-[#0a0a0a] border border-white/20 p-2 shadow-2xl overflow-hidden"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
              >
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                  <div className="w-1.5 h-1.5 bg-[#4af0ff]" />
                  <div className="w-1.5 h-1.5 bg-[#4af0ff]/50" />
                  <div className="w-1.5 h-1.5 bg-[#4af0ff]/20" />
                </div>

                {/* The Warrior Image */}
                <div className="relative aspect-[4/5] bg-neutral-900 group-hover:scale-105 transition-transform duration-700">
                  <img
                    src={NINJA_IMG}
                    alt="Cyberpunk Ninja"
                    className="w-full h-full object-cover grayscale-[0.2] contrast-[1.2] hover:grayscale-0 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="text-[10px] text-[#4af0ff] mb-1 tracking-[4px]">WARRIOR_PROTOCOL</div>
                  <div className="text-xl font-bold text-white uppercase italic">Zero Spectrum</div>
                </div>
              </motion.div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ x: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 hidden xl:block"
            >
              <div className="text-[8px] text-white/40 rotate-90 tracking-[8px] font-mono">
                X-77_SYSTEM_OVERRIDE
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .bg-glow {
          box-shadow: 0 0 8px #fff;
        }
      `}</style>
    </section>
  );
};

export default ESports;
