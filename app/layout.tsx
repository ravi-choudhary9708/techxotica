import type { Metadata } from "next";
import { Orbitron, Inter, Rajdhani, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
  weight: ["300", "400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Techexotica 2026 | GEC Madhubani Annual Techfest",
  description:
    "Techexotica is the annual technical festival of Government Engineering College Madhubani, Bihar. Featuring competitions, hackathons, workshops and much more.",
  keywords: "Techexotica, GEC Madhubani, techfest, engineering festival, Bihar, competitions, hackathon, workshops",
  openGraph: {
    title: "Techexotica 2026 | GEC Madhubani",
    description: "The biggest tech festival in Bihar. Register now for competitions, hackathons & workshops.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(orbitron.variable, inter.variable, rajdhani.variable, "font-sans", geist.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
