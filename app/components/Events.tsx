import React from "react";
import Link from "next/link";
import { ExpandCards, ExpandCardItem } from "@/components/ui/expand-cards";
import { ArrowRight } from "lucide-react";

const majorEvents: ExpandCardItem[] = [
  {
    id: 1,
    title: "Competitive Coding",
    description: "The ultimate test of algorithms and data structures. Solve intense problems and climb the local leaderboard.",
    imageSrc: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Robotics/Robo Wars",
    description: "Build, program, and battle robots. From autonomous navigation to heavy-duty mechanical engineering.",
    imageSrc: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "E-Sports",
    description: "Professional gaming on the big stage. Compete in high-stakes matches and dominate the leaderboard.",
    imageSrc: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Short Film",
    description: "5 minutes of cinematic brilliance. Tell a compelling story using your camera and editing skills.",
    imageSrc: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Treasure Hunt",
    description: "The campus is your playground. Solve cryptic clues and find the hidden glory in this massive scavenge.",
    imageSrc: "https://images.unsplash.com/photo-1513267768898-216229555024?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Events() {
  return (
    <section id="events" className="story-section pb-48">
      {/* Background glow */}
      <div className="story-bg-base bg-gradient-to-bl from-[#00f5ff]/10 to-transparent" />

      <div className="story-container">
        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-2">Competition Hub</p>
          <h2 className="section-title gradient-text">Major Events</h2>
          <div className="section-divider">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          </div>
          <p className="section-subtitle">
            Experience our flagship technical and creative showdowns
          </p>
        </div>

        {/* Expand Cards component */}
        <div className="reveal w-full max-w-6xl mx-auto px-4 mb-20 overflow-visible">
          <ExpandCards items={majorEvents} />
        </div>

        {/* Show all button */}
        <div className="reveal flex justify-center mt-12">
          <Link
            href="/events"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-rajdhani text-lg font-bold tracking-widest text-[#02040d] overflow-hidden rounded-md bg-[#00f5ff] transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0" />
            <span className="relative flex items-center gap-3">
              EXPLORE ALL 20+ EVENTS
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
