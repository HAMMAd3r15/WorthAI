"use client"

import { motion } from "framer-motion"
import { Shield, Target, UserCheck } from "lucide-react"

const aboutContent = {
  badge: "The Mission",
  title: "Democratizing financial intelligence",
  italicTitle: "for Everyone",
  description: [
    "Most financial tools stop at tracking. They tell you what happened, but not why it happened or what to do next. We built WorthAI to bridge that gap.",
    "By combining deep contextual awareness with sharp, uncompromising logic, we're making premium financial advisory accessible to every individual. No gatekeepers. No subscriptions. Just clarity."
  ],
  values: [
    {
      icon: Shield,
      title: "Data Sovereignty",
      text: "You own your numbers. We never sell your data or connect to your banks. Your financial footprint remains under your total control."
    },
    {
      icon: Target,
      title: "Contextual Precision",
      text: "Generic advice is useless. WorthAI factors in your unique income, debt weight, and life goals to give verdicts that actually matter."
    },
    {
      icon: UserCheck,
      title: "Unbiased Guidance",
      text: "Our AI doesn't have a quota to fill or a product to sell. It's a pure logic engine designed to protect your net worth above all else."
    }
  ]
}

export function AboutSection() {
  return (
    <section className="bg-transparent py-40 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          {/* Left Side: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 border border-primary/20 rounded-full">
              {aboutContent.badge}
            </span>
            <h2 className="text-5xl md:text-6xl font-josefin font-bold tracking-tighter text-white mb-10 leading-[1.1]">
              {aboutContent.title} <br />
              <span className="text-primary italic">{aboutContent.italicTitle}</span>
            </h2>
            <div className="space-y-6">
              {aboutContent.description.map((p, i) => (
                <p key={i} className="text-secondary text-lg leading-relaxed font-josefin max-w-xl opacity-80">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Abstract Graphic / Feature Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[450px] mx-auto flex items-center justify-center">
              {/* Glassmorphism Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[60px] blur-3xl opacity-30" />
              <div className="relative w-full h-full bg-[#11141D]/40 backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 flex flex-col justify-center shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="text-primary italic font-josefin text-4xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">"Numbers tell a story. We help you write the conclusion."</div>
                <div className="h-px bg-white/10 w-24 mb-6" />
                <div className="text-xs uppercase tracking-[0.4em] text-secondary/40 font-bold">WorthAI Core Manifesto</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {aboutContent.values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
              className="p-10 rounded-3xl bg-secondary/[0.02] border border-white/[0.03] hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-josefin font-bold text-white mb-4 tracking-wider uppercase">{v.title}</h3>
              <p className="text-secondary/60 text-[15px] leading-relaxed font-josefin">
                {v.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
