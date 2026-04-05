"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const cards = [
  {
    heading: "Know exactly where you stand",
    text: "Most people have a rough idea of their finances but no clear picture. Worth gives you a real-time snapshot of your income, expenses, savings and debts in one place so you always know exactly where you stand financially."
  },
  {
    heading: "Get advice that knows your numbers",
    text: "Generic financial advice is useless. Worth knows your exact income, expenses and debts before you ask anything. Every answer is calculated using your real numbers, not advice that could apply to anyone."
  },
  {
    heading: "Build better financial habits",
    text: "Small decisions compound over time. Worth helps you understand the real impact of every financial decision, from buying a phone to paying off debt, so you can build habits that actually move you forward."
  }
]

export function HowItHelps() {
  return (
    <section className="bg-[#0A0D14] py-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">The Worth Advantage</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-josefin font-bold text-white mb-8 tracking-tight leading-[1.1]"
          >
            How <span className="text-[#C9A84C] italic">Worth</span> Helps You
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-secondary/60 font-josefin max-w-2xl mx-auto leading-relaxed"
          >
            Clarity is the first step toward financial freedom. 
            Worth provides the intelligence you need to make better decisions every single day.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="h-full"
            >
              <Card className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-12 h-full rounded-[48px] flex flex-col hover:border-[#C9A84C]/40 transition-all duration-700 group shadow-2xl relative overflow-hidden">
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h3 className="text-xl md:text-2xl font-josefin font-bold mb-8 text-[#C9A84C] uppercase tracking-widest leading-tight relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                  {card.heading}
                </h3>
                <p className="text-white/80 text-[17px] leading-[1.8] font-josefin font-medium relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {card.text}
                </p>
                
                {/* Corner Decoration */}
                <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                  <div className="w-12 h-12 border-b-2 border-r-2 border-[#C9A84C]" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
