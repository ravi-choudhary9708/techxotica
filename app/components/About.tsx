"use client";

import HeroSection from "@/components/ui/hero-section-3";

const navLinks = [
  { href: "#about-madhubani", label: "Culture" },
  { href: "#events", label: "Events" },
  { href: "#hackathon", label: "Hackathon" },
  { href: "#workshops", label: "Workshops" },
  { href: "#schedule", label: "Schedule" },
];

export default function About() {
  return (
    <section id="about" className="relative">
      <HeroSection
        backgroundImage="https://i.ibb.co/3K3j0PR/unnamed-3.png"
        logoText="GEC MADHUBANI"
        navLinks={navLinks}
        versionText="ESTABLISHED 2019 • AICTE APPROVED"
        title="Centre of Excellence"
        subtitle="Government Engineering College Madhubani is dedicated to producing globally competent engineers through innovation and socio-economic growth."
        ctaText="Explore Campus"
      />
    </section>
  );
}
