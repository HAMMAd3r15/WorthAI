"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Is my financial data safe?",
    answer: "Absolutely. Your financial profile is encrypted and stored securely. We never sell your data or share it with third parties. You can delete your account and all associated data at any time."
  },
  {
    question: "Do I need to connect my bank account?",
    answer: "No. Worth never connects to your bank. You manually enter your income, expenses, and debts — which actually makes it more accurate because you control exactly what Worth knows about you."
  },
  {
    question: "What kind of questions can I ask Worth?",
    answer: "Anything financial. Should I buy a car? Can I afford to move out? How long until I'm debt free? What should I do with $500 extra this month? If it involves your money Worth can help."
  },
  {
    question: "Can I update my financial profile?",
    answer: "Yes anytime. Life changes and your profile should too. Update your income, add a new expense, or clear a debt — Worth will factor in your latest numbers automatically."
  },
  {
    question: "Is the free plan actually useful?",
    answer: "Yes. 5 questions per day is enough to make real financial decisions. The Pro plan is for people who want unlimited access and more detailed advice for complex financial situations."
  },
  {
    question: "What if I want to cancel my subscription?",
    answer: "Cancel anytime with one click from your settings page. No hidden fees, no cancellation calls, no drama."
  }
]

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="bg-[#0A0D14] py-32 relative overflow-hidden">
      <div className="max-w-[760px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-josefin font-bold text-white mb-6 tracking-tight"
          >
            Questions <span className="text-primary italic">worth</span> asking
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary/60 font-josefin"
          >
            Everything you need to know before getting started.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="border-b border-white/5 last:border-0"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full py-8 flex items-center justify-between text-left group transition-all"
              >
                <span className={`text-xl font-medium transition-colors duration-300 ${openIdx === idx ? 'text-primary' : 'text-white/90 group-hover:text-primary/70'}`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${openIdx === idx ? 'text-primary' : 'text-white/40'}`}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 text-secondary/70 leading-relaxed text-[17px] font-josefin pr-12">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
