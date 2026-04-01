"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { AetherFlowBackground } from "@/components/ui/aether-flow-background"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  // Parallax for orbs
  const orbY1 = useTransform(scrollY, [0, 500], [0, 100])
  const orbY2 = useTransform(scrollY, [0, 500], [0, -150])
  const orbY3 = useTransform(scrollY, [0, 500], [0, 50])

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  }

  return (
    <>
      {/* Part 1: Typography & CTA (Refined Spacing & Scaling) */}
      <section ref={containerRef} className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden pt-[120px] pb-[80px]">
        {/* Interactive Particle Flow */}
        <AetherFlowBackground />

        <div className="max-w-[1100px] mx-auto px-6 text-center relative z-10 flex flex-col items-center flex-1 justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span 
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="inline-block px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 border border-primary/20 rounded-full"
            >
              Wealth Intelligence
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-[64px] font-josefin font-bold mb-8 leading-[1.1] tracking-tighter text-white"
            >
              Know your numbers.<br />
              <span className="text-primary italic">Own your future.</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="max-w-xl mx-auto text-[18px] text-secondary mb-12 leading-relaxed font-josefin"
            >
              The premium financial advisor, now free for everyone. 
              WorthAI is the first context-aware guide that understands 
              the weight of your decisions.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <a href="#pricing">
                <Button size="lg" className="h-[56px] px-[48px] text-[16px] bg-primary text-black hover:scale-105 transition-transform shadow-[0_0_25px_rgba(201,168,76,0.3)] font-bold rounded-2xl">
                  Get Started Free
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Part 2: Interactive Demo (Spacious & Tall enough for full response) */}
      <section className="py-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[900px] w-full mx-auto px-6"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/10 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            
            <div className="relative bg-[#11141D] border border-white/10 rounded-2xl shadow-2xl overflow-visible">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">WorthAI Engine v2.0</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-10 space-y-10">
                {/* User Message */}
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-black ml-1">Current Query</span>
                  <div className="bg-white/5 p-5 rounded-2xl rounded-tl-none border border-white/5 text-secondary text-lg leading-relaxed italic">
                    "I want to buy a $45,000 car. Can I afford this?"
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex flex-col gap-4 items-end ml-auto max-w-[95%]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black mr-1 text-right">Advisor Logic</span>
                  <div className="bg-primary/[0.03] p-8 rounded-2xl rounded-tr-none border border-primary/20 shadow-[0_0_50px_rgba(201,168,76,0.03)]">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Live Verdict</span>
                      <span className="px-4 py-1 bg-amber-500/10 text-amber-500 text-[11px] font-black rounded-full border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)] uppercase tracking-wider">
                        Not Yet
                      </span>
                    </div>

                    <p className="text-white text-[15px] leading-relaxed mb-8 opacity-90">
                      Based on your <span className="text-primary font-bold">$6.5k</span> monthly income and existing <span className="text-primary font-bold">$15k</span> student debt, 
                      this purchase is aggressive. With your <span className="text-primary font-bold">$12k</span> liquid savings, this acquisition would leave you with 
                      less than <span className="text-primary font-bold">1.2 months</span> of emergency runway.
                    </p>

                    <div className="space-y-6">
                      <div className="h-px bg-white/5 w-full" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: "Increase Savings", target: "$22,000" },
                          { label: "Debt Threshold", target: "< $8,000" },
                          { label: "Timeframe", target: "7 Months" }
                        ].map((step, idx) => (
                          <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-[9px] text-secondary uppercase tracking-widest block mb-1">{step.label}</span>
                            <span className="text-sm font-bold text-primary">{step.target}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-primary rounded-full" />
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-primary rounded-full" />
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-primary rounded-full" />
                      </div>
                      <span className="text-[10px] text-secondary/40 italic font-josefin">Recalculating optimal path...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
