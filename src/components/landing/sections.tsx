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
            Completely Free. Forever.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary text-lg font-josefin max-w-xl mx-auto"
          >
            We believe financial clarity shouldn't have a price tag. 
            Access every premium feature at no cost.
          </motion.p>
        </div>

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-transparent rounded-[40px] blur-lg opacity-40 group-hover:opacity-100 transition duration-1000" />
              <Card className="relative flex flex-col items-center text-center h-full bg-[#11141D] border-primary/20 p-12 shadow-2xl z-10 rounded-[40px]">
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-6 text-primary uppercase tracking-[0.3em]">Full Access</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-6">
                    <span className="text-7xl font-bold text-white font-josefin">$0</span>
                    <span className="text-secondary font-josefin text-xl">/forever</span>
                  </div>
                  <p className="text-secondary font-josefin italic opacity-80">No credit card. No subscriptions. No nonsense.</p>
                </div>
                
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12 text-left">
                  {[
                    "10 AI questions per day",
                    "Unlimited income sources",
                    "Full Monthly Health Audit",
                    "Debt & savings tracking",
                    "Honest, sharp AI advice",
                    "Premium data security"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-white/90 font-josefin text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="w-full">
                  <Button className="w-full h-16 bg-primary text-black font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all rounded-3xl shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                    Create Your Account
                  </Button>
                </Link>

                <p className="mt-8 text-[10px] text-secondary/40 font-bold uppercase tracking-widest">
                  Trusted by users worldwide for financial intelligence
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
