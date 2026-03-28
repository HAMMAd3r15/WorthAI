"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Wallet, Zap, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

export function Features() {
  const steps = [
    {
      icon: Wallet,
      title: "Input details once",
      description: "Enter your income, expenses, debts, and savings. We handle the math with precision."
    },
    {
      icon: Zap,
      title: "Ask anything",
      description: "Ask advice for complex purchases, debt strategies, or bespoke monthly budgets."
    },
    {
      icon: ShieldCheck,
      title: "Get clear verdicts",
      description: "No generic fluff. Just Yes, No, or Not Yet with a concrete, actionable plan."
    }
  ]

  return (
    <section className="py-40 relative">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <Card className="bg-transparent border-none shadow-none group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl items-center justify-center flex mb-8 group-hover:bg-primary/10 transition-colors border border-primary/10">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-josefin font-bold mb-6 text-white uppercase tracking-widest">{step.title}</h3>
                <p className="text-secondary text-base leading-relaxed font-josefin">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-32 bg-[#0A0D14] border-y border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-josefin font-bold mb-6 text-white tracking-tight"
          >
            Choose your path
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary text-lg font-josefin mb-10"
          >
            Start for free or upgrade for unlimited wisdom.
          </motion.p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${!isYearly ? 'text-primary' : 'text-secondary/50'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-white/5 rounded-full relative border border-white/10 p-1"
            >
              <motion.div 
                animate={{ x: isYearly ? 32 : 0 }}
                className="w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]"
              />
            </button>
            <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${isYearly ? 'text-primary' : 'text-secondary/50'}`}>Yearly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="flex flex-col h-full bg-[#11141D]/50 border-white/5 p-10 backdrop-blur-sm group hover:border-white/10 transition-all rounded-[32px]">
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">Free</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-white font-josefin font-bold">$0</span>
                  <span className="text-secondary font-josefin">{isYearly ? '/year' : '/month'}</span>
                </div>
                <p className="text-secondary font-josefin">Perfect for getting started.</p>
              </div>
              <ul className="space-y-6 mb-12 flex-1">
                {[
                  "5 AI questions per day",
                  "Single income source",
                  "Basic expense tracking",
                  "Standard AI model access"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-secondary font-josefin">
                    <Check className="w-5 h-5 text-primary/50" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full h-14 border-white/10 hover:border-white/30 text-white rounded-2xl">Get Started</Button>
              </Link>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-full group">
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-transparent rounded-[32px] blur-lg opacity-0 group-hover:opacity-100 transition duration-1000" />
              <Card className="relative flex flex-col h-full bg-[#11141D] border-primary/20 p-10 shadow-2xl scale-105 z-10 rounded-[32px]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(201,168,76,0.4)]">
                  Most Popular
                </div>
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-widest">Pro</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold text-white font-josefin font-bold">${isYearly ? '100' : '10'}</span>
                    <span className="text-secondary font-josefin">{isYearly ? '/year' : '/month'}</span>
                  </div>
                  <p className="text-secondary font-josefin">Everything you need to master your finances.</p>
                </div>
                <ul className="space-y-6 mb-12 flex-1">
                  {[
                    "Unlimited AI questions",
                    "Multiple income sources",
                    "Full debt and savings tracking",
                    "Priority response speed"
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-4 text-white font-josefin">
                      <Check className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(201,168,76,0.3)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=pro">
                  <Button className="w-full h-14 bg-primary text-black font-bold hover:scale-[1.02] transition-transform rounded-2xl">Go Pro</Button>
                </Link>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
