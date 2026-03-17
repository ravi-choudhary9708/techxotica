"use client";

export default function AboutMadhubani() {
  return (
    <section id="about-madhubani" className="story-section">
      {/* Background glow */}
      <div className="story-bg-base bg-gradient-to-br from-[#ec4899]/20 to-transparent" />
      
      <div className="story-container">
        {/* Title */}
        <div className="reveal">
          <h2 className="section-title">
            About <span className="neon-text-pink">Madhubani</span>
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          <div className="reveal order-2 lg:order-1 glass-card p-8 md:p-12 relative overflow-hidden">
            <h3 className="font-orbitron font-bold text-3xl md:text-4xl text-white mb-2">The Forest of Honey</h3>
            <p className="font-rajdhani text-sm tracking-[0.2em] uppercase text-[#ec4899] mb-8">Cultural Heart of Mithila</p>
            
            <div className="space-y-6 font-inter text-slate-300 leading-relaxed text-lg">
               <p>
                 Madhubani, cradled in the northern plains of Bihar, is one of the world&apos;s most culturally vibrant living regions — a place of timeless art and enduring mythology. Its name translates to <span className="text-white italic">&quot;Forest of Honey,&quot;</span> hinting at a natural beauty that has inspired poets and painters for millennia.
               </p>
               <p>
                 Known as the Cultural Capital of the Mithila region, it beautifully blends sacred ancient rites with the world-renowned <strong className="text-[#00f5ff]">Mithila Art</strong>. The intricate, colorful geometric patterns that historically adorned mud-hut walls now carry the stories of the ancient Videha kingdom across the globe — serving as a lively, sensory backdrop to academic and artistic traditions like those at GEC Madhubani.
               </p>
               <p className="text-white font-medium pt-6 border-t border-[rgba(236,72,153,0.2)]">
                 Join us at <span className="neon-text-purple">Techexotica &apos;26</span> to experience cutting‑edge innovation alongside the living traditions of Madhubani — a city that leaves a lasting impression and where the past and future beautifully collide.
               </p>
            </div>
            
            {/* Decorative background element inside card */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ec4899] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          </div>

          <div className="reveal order-1 lg:order-2 flex justify-center relative">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden glass-card animated-border p-1">
                <div className="absolute inset-1 bg-[#02040d] rounded-xl overflow-hidden flex items-center justify-center">
                   {/* Abstract representation of Madhubani art via CSS */}
                   <div 
                     className="absolute inset-0 opacity-40 mix-blend-screen"
                     style={{
                       backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.15) 0%, transparent 60%), linear-gradient(45deg, rgba(0,245,255,0.05) 25%, transparent 25%, transparent 75%, rgba(0,245,255,0.05) 75%, rgba(0,245,255,0.05)), linear-gradient(45deg, rgba(0,245,255,0.05) 25%, transparent 25%, transparent 75%, rgba(0,245,255,0.05) 75%, rgba(0,245,255,0.05))',
                       backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                       backgroundPosition: '0 0, 0 0, 20px 20px'
                     }}
                   />
                   <div className="text-center z-10 p-8 flex flex-col items-center">
                     <div className="w-24 h-24 border border-[#ec4899] rotate-45 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                        <div className="w-20 h-20 border border-[#00f5ff] absolute flex items-center justify-center">
                            <span className="font-orbitron text-2xl text-white -rotate-45 block">M</span>
                        </div>
                     </div>
                     <p className="font-rajdhani text-2xl tracking-[0.4em] uppercase neon-text-pink leading-tight">
                       Timeless
                       <br/>Legacy
                     </p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
