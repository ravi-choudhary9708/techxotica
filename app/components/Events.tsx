"use client";

import React, { useState } from "react";
import ExpandCards from "@/components/ui/expand-cards";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Software", "Hardware", "Creative", "Specials"];

const eventItems = [
  // --- SOFTWARE & CODING ---
  {
    title: "Web Design",
    category: "Software",
    description: "Craft visually stunning and highly functional web interfaces. Show off your HTML, CSS, and JS prowess.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop",
    color: "#00f5ff",
  },
  {
    title: "UI/UX Design",
    category: "Software",
    description: "Experience design at its finest. Create user-centric prototypes that solve real-world problems with elegance.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
    color: "#00f5ff",
  },
  {
    title: "Code Debugging",
    category: "Software",
    description: "Hunt down the bugs in complex systems. A race against time to fix broken code and optimize performance.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
    color: "#00f5ff",
  },
  {
    title: "Blind Coding",
    category: "Software",
    description: "Can you code with your monitor off? Test your syntax memory and typing precision in this extreme challenge.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    color: "#00f5ff",
  },
  {
    title: "Competitive Coding",
    category: "Software",
    description: "The ultimate test of algorithms and data structures. Solve intense problems and climb the local leaderboard.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
    color: "#00f5ff",
  },

  // --- HARDWARE & ENGINEERING ---
  {
    title: "Robotics",
    category: "Hardware",
    description: "Build, program, and battle robots. From autonomous navigation to heavy-duty mechanical engineering.",
    image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "Circuit Design",
    category: "Hardware",
    description: "Blueprint the future of electronics. Design efficient and innovative PCB layouts and logic circuits.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "CAD Challenge",
    category: "Hardware",
    description: "Visualize engineering marvels. Create detailed 3D models and structural designs using industry-standard tools.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "Bridge Building",
    category: "Hardware",
    description: "Architecture meets physics. Construct weight-bearing structures and test their breaking points.",
    image: "https://images.unsplash.com/photo-1545624135-24cf3be8f669?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "Model Making",
    category: "Hardware",
    description: "Detailed craftsmanship of physical prototypes. From miniature cities to complex mechanical systems.",
    image: "https://images.unsplash.com/photo-1558717738-0b9fbb9b0b21?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "Model Exhibition",
    category: "Hardware",
    description: "Showcase your engineering creations to the world. A platform for inventors to explain their masterpieces.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },
  {
    title: "Model Escape Room",
    category: "Hardware",
    description: "Design an immersive physical puzzle experience. Engineering logic used to create an inescapable maze.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
    color: "#ffd700",
  },

  // --- CREATIVE & MEDIA ---
  {
    title: "Short Film",
    category: "Creative",
    description: "5 minutes of cinematic brilliance. Tell a compelling story using your camera and editing skills.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    title: "Photography",
    category: "Creative",
    description: "Capture the essence of Techexotica. A competition for the best lens through which to see the fest.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    title: "Logo Design",
    category: "Creative",
    description: "Create the visual identity of a brand. Minimalist, impactful, and memorable graphic design challenge.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    title: "Poster Talk",
    category: "Creative",
    description: "Present complex technical info through visual storytelling. One poster, one talk, ultimate impact.",
    image: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },

  // --- SPECIALS ---
  {
    title: "Treasure Hunt",
    category: "Specials",
    description: "The campus is your playground. Solve cryptic clues and find the hidden glory in this massive scavenge.",
    image: "https://images.unsplash.com/photo-1513267768898-216229555024?q=80&w=1000&auto=format&fit=crop",
    color: "#a855f7",
  },
  {
    title: "E-Sports",
    category: "Specials",
    description: "Professional gaming on the big stage. Compete in high-stakes matches and dominate the leaderboard.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    color: "#a855f7",
  },
  {
    title: "Expo",
    category: "Specials",
    description: "A showcase of industrial giants and student startups alike. Discover the latest tech trends here.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
    color: "#a855f7",
  },
];

export default function Events() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredItems = activeTab === "All" 
    ? eventItems 
    : eventItems.filter(item => item.category === activeTab);

  return (
    <section id="events" className="story-section pb-32">
      {/* Background glow */}
      <div className="story-bg-base bg-gradient-to-bl from-[#00f5ff]/10 to-transparent" />

      <div className="story-container">
        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">Competition Hub</p>
          <h2 className="section-title gradient-text">Events &amp; Competitions</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
          <p className="section-subtitle">
            Browse our 20+ elite competition tracks categorized for you
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full font-orbitron text-xs tracking-wider border transition-all duration-300 ${
                activeTab === cat 
                  ? "bg-[#00f5ff] text-[#02040d] border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.4)]" 
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-white/30"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Expand Cards component with key for animation reset */}
        <div className="reveal min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExpandCards items={filteredItems} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
