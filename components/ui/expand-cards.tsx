"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ExpandCardItem {
  id: string | number;
  title: string;
  imageSrc: string;
  description?: string;
}

export function ExpandCards({ items }: { items: ExpandCardItem[] }) {
  const [expandedImage, setExpandedImage] = useState(0);

  return (
    <div className="w-full flex items-center justify-center bg-transparent mt-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[60vh] md:h-[28rem] items-stretch justify-center gap-2">
        {items.map((item, idx) => {
          const isActive = idx === expandedImage;
          return (
            <div
              key={item.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out border-2",
                isActive 
                  ? "flex-[4_1_0%] border-[#00f5ff]/40 shadow-[0_0_20px_rgba(0,245,255,0.2)]" 
                  : "flex-[0_1_4rem] md:flex-[0_1_5rem] border-white/5 hover:border-white/20"
              )}
              onMouseEnter={() => setExpandedImage(idx)}
              onClick={() => setExpandedImage(idx)}
            >
              <img
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                  isActive ? "scale-105" : "scale-100 grayscale-[40%] group-hover:grayscale-0"
                )}
                src={item.imageSrc}
                alt={item.title}
              />
              
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              {isActive && (
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-white font-orbitron font-bold text-2xl md:text-3xl mb-2 drop-shadow-md">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-300 font-rajdhani text-sm md:text-base max-w-lg line-clamp-2 md:line-clamp-none drop-shadow-md">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
