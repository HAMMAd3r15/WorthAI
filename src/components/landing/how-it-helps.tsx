"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const cards = [
  {
    heading: "Know exactly where you stand",
    text: "Most people have a rough idea of their finances but no clear picture. Worth gives you a real-time snapshot of your income, expenses, savings and debts in one place — so you always know exactly where you stand financially."
  },
  {
    heading: "Get advice that knows your numbers",
    text: "Generic financial advice is useless. Worth knows your exact income, expenses and debts before you ask anything. Every answer is calculated using your real numbers — not advice that could apply to anyone."
  },
  {
    heading: "Build better financial habits",
    text: "Small decisions compound over time. Worth helps you understand the real impact of every financial decision — from buying a phone to paying off debt — so you can build habits that actually move you forward."
  }
]

export function HowItHelps() {
  return (
    <section className="bg-[#0A0D14] py-32 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-josefin font-bold text-white mb-6 tracking-tight"
          >
            How <span className="text-[#C9A84C] italic">Worth</span> Helps You
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary/60 font-josefin max-w-2xl mx-auto"
          >
            Clarity is the first step toward financial freedom. 
            Worth provides the intelligence you need to make better decisions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="h-full"
            >
              <Card className="bg-[#111827] border border-white/5 p-10 h-full rounded-[40px] flex flex-col hover:border-[#C9A84C]/30 transition-all duration-500 group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl font-josefin font-bold mb-6 text-[#C9A84C] uppercase tracking-widest leading-tight">
                  {card.heading}
                </h3>
                <p className="text-white/90 text-base leading-relaxed font-josefin font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  {card.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
