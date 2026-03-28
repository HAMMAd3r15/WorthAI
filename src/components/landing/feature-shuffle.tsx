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
    <section className="py-40 relative overflow-hidden bg-[#0A0D14]">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-primary blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
          
          {/* Text Content */}
          <div className="flex-1 space-y-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="inline-block">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 border border-primary/20 rounded-full bg-primary/5">
                  The Worth Method
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-josefin font-bold text-white tracking-tight leading-[1.1]">
                Simple logic. <br />
                <span className="text-primary">Premium results.</span>
              </h2>
              <p className="text-secondary/70 text-lg md:text-xl font-josefin max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
                We've distilled complex financial advisory into a three-step process designed for clarity.
              </p>
            </motion.div>

            <div className="flex items-center gap-6 justify-center md:justify-start">
                <button 
                  onClick={handleShuffle}
                  className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all font-josefin group"
                >
                  Swipe to Explore
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                </button>
            </div>
          </div>

          {/* Shuffling Cards Container */}
          <div className="relative flex justify-center h-[500px] w-full max-w-[350px] md:max-w-none md:flex-1">
            <div className="relative h-[450px] w-[320px] md:w-[350px]">
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
