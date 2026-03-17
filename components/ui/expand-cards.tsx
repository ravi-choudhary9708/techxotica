"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandCardItem {
  title: string;
  category: string;
  image: string;
  color: string;
  description: string;
}

interface ExpandCardsProps {
  items: ExpandCardItem[];
}

const ExpandCards = ({ items }: ExpandCardsProps) => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLg(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="flex flex-col lg:flex-row w-full gap-4 items-stretch justify-center">
        {items.map((item, idx) => {
          const isExpanded = idx === expandedIndex;
          
          return (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => setExpandedIndex(idx)}
              onMouseEnter={() => {
                if (isLg) setExpandedIndex(idx);
              }}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-700 ease-in-out group min-h-[140px]",
                isExpanded ? "flex-[5] h-[450px] lg:h-[500px]" : "flex-1 h-[140px] lg:h-[500px]"
              )}
              style={{
                border: `1px solid ${isExpanded ? item.color : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isExpanded ? `0 0 40px ${item.color}22` : 'none'
              }}
            >
              {/* Image background */}
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={item.image}
                alt={item.title}
              />
              
              {/* Overlay */}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500",
                  isExpanded ? "opacity-95" : "opacity-70 group-hover:opacity-50"
                )} 
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  {isExpanded ? (
                    <motion.div
                      key="expanded-content"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span 
                        className="font-rajdhani text-[10px] md:text-xs tracking-[0.4em] uppercase mb-1 md:2 block"
                        style={{ color: item.color }}
                      >
                        {item.category}
                      </span>
                      <h3 className="font-orbitron font-black text-2xl md:text-4xl text-white mb-2 md:mb-4 uppercase tracking-tighter">
                        {item.title}
                      </h3>
                      <p className="font-rajdhani text-slate-300 max-w-md leading-relaxed text-xs md:text-base mb-4 md:mb-6">
                        {item.description}
                      </p>
                      <button 
                        className="btn-neon-solid text-[10px] py-1.5 md:py-2 px-4 md:px-6"
                        style={{ background: item.color, color: '#000' }}
                      >
                        Register Now
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collapsed-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center lg:items-end lg:justify-start"
                    >
                      <h3 
                        className="font-orbitron font-bold text-lg lg:text-xl text-white whitespace-nowrap lg:rotate-[-90deg] lg:origin-left lg:absolute lg:bottom-12 lg:left-12 uppercase tracking-widest"
                        style={{ textShadow: `0 0 10px ${item.color}` }}
                      >
                        {item.title}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Glow */}
              <div 
                className="absolute top-4 right-4 md:top-6 md:right-6 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse"
                style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandCards;
