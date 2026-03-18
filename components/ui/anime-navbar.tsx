"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mascot when clicking away could be added, but for now let's keep it simple

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.url.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(item.url);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setActiveTab(item.name);
    }
  };

  if (!mounted) return null

  return (
    <div className={cn("fixed top-16 left-0 right-0 z-[9999]", className)}>
      <div className="flex justify-center pt-6">
        <motion.div
          className="flex items-center gap-4 md:gap-16 bg-black/60 border border-white/20 backdrop-blur-3xl py-3 md:py-8 px-6 md:px-20 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.7)] relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={(e) => handleNavClick(e, item)}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-sm font-orbitron font-semibold px-4 md:px-24 py-3 md:py-9 rounded-full transition-all duration-300",
                  "text-white/60 hover:text-white",
                  isActive && "bg-white/10 text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-[#00f5ff]/20 rounded-full blur-md" />
                    <div className="absolute inset-[-4px] bg-[#00f5ff]/15 rounded-full blur-xl" />

                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      style={{
                        animation: "shine 4s ease-in-out infinite"
                      }}
                    />
                  </motion.div>
                )}

                <motion.span
                  className="hidden md:inline relative z-10 tracking-[0.2em] uppercase text-[11px] font-bold"
                >
                  {item.name}
                </motion.span>
                <motion.span
                  className="md:hidden relative z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </motion.span>

                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/5 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="anime-mascot"
                    className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="relative w-16 h-16">
                      <motion.div
                        className="absolute w-14 h-14 bg-white rounded-full left-1/2 -translate-x-1/2 shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                        animate={
                          hoveredTab ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                            transition: {
                              duration: 0.5,
                              ease: "easeInOut"
                            }
                          } : {
                            y: [0, -4, 0],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        }
                      >
                        {/* Eyes */}
                        <motion.div
                          className="absolute w-1.5 h-1.5 bg-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ left: '30%', top: '40%' }}
                        />
                        <motion.div
                          className="absolute w-1.5 h-1.5 bg-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ right: '30%', top: '40%' }}
                        />
                        {/* Blush */}
                        <motion.div
                          className="absolute w-2 h-1 bg-pink-300/60 rounded-full"
                          style={{ left: '20%', top: '55%' }}
                        />
                        <motion.div
                          className="absolute w-2 h-1 bg-pink-300/60 rounded-full"
                          style={{ right: '20%', top: '55%' }}
                        />

                        {/* Mouth */}
                        <motion.div
                          className="absolute w-3 h-1.5 border-b-2 border-black rounded-full"
                          animate={
                            hoveredTab ? {
                              scaleY: 1.5,
                              y: -0.5
                            } : {
                              scaleY: 1,
                              y: 0
                            }
                          }
                          style={{ left: '35%', top: '55%' }}
                        />

                        {/* Sparkles */}
                        <AnimatePresence>
                          {hoveredTab && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-2 -right-2 w-3 h-3 text-yellow-300 text-[10px]"
                              >
                                ✨
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute -top-3 left-0 w-3 h-3 text-yellow-300 text-[10px]"
                              >
                                ✨
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Tail/Indicator */}
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
                        animate={
                          hoveredTab ? {
                            y: [0, -3, 0],
                            transition: {
                              duration: 0.3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }
                          } : {
                            y: [0, 2, 0],
                            transition: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }
                          }
                        }
                      >
                        <div className="w-full h-full bg-white rotate-45 transform origin-center shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
