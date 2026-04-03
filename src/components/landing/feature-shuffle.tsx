"use client";

import { useState } from "react";
import { FeatureCard } from "@/components/ui/feature-cards";
import { Wallet, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Input details once",
    description: "Enter your income, expenses, debts, and savings. We handle the math with precision.",
    icon: Wallet
  },
  {
    id: 2,
    title: "Ask anything",
    description: "Ask advice for complex purchases, debt strategies, or bespoke monthly budgets.",
    icon: Zap
  },
  {
    id: 3,
    title: "Get clear verdicts",
    description: "No generic fluff. Just Yes, No, or Not Yet with a concrete, actionable plan.",
    icon: ShieldCheck
  }
];

export function FeatureShuffle() {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    const last = newPositions.pop();
    if (last) newPositions.unshift(last);
    setPositions(newPositions);
  };

  return (
    <section className="py-48 relative overflow-hidden bg-[#0A0D14]">
      {/* Premium Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-24 lg:gap-32">
          
          {/* Text Content */}
          <div className="flex-1 space-y-12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="inline-block">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] px-5 py-2.5 border border-primary/20 rounded-full bg-primary/5 shadow-[0_0_20px_rgba(201,168,76,0.1)]">
                  The Worth Method
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-josefin font-bold text-white tracking-tighter leading-[1.05]">
                Simple logic. <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Premium results.
                </span>
              </h2>
              <p className="text-secondary/60 text-lg md:text-xl font-josefin max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                We've distilled elite financial advisory into a sharp, three-step engine designed for absolute clarity. 
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="flex items-center gap-6 justify-center lg:justify-start"
            >
                <button 
                  onClick={handleShuffle}
                  className="px-10 py-4 rounded-full bg-primary/5 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-primary/10 hover:border-primary/40 transition-all duration-500 font-josefin group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Swipe to Explore
                    <span className="inline-block transition-transform group-hover:translate-x-1.5 duration-500">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </button>
            </motion.div>
          </div>

          {/* Shuffling Cards Container */}
          <div className="relative flex justify-center h-[550px] w-full max-w-[400px] lg:max-w-none lg:flex-1 perspective-1000">
            <div className="relative h-[500px] w-[320px] md:w-[360px]">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  {...feature}
                  handleShuffle={handleShuffle}
                  position={positions[index]}
                  index={index}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
