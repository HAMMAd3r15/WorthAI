"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "2,400+", label: "Questions Answered" },
  { value: "180+", label: "Active Users" },
  { value: "4.9/5", label: "Average Rating" },
]



export function SocialProof() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="bg-[#111827] py-24 relative overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Row */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="flex-1 text-center relative"
            >
              <h3 className="text-4xl md:text-5xl font-josefin font-bold text-primary mb-3 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-secondary/60 uppercase tracking-widest font-josefin">
                {stat.label}
              </p>
              
              {/* Divider */}
              {idx < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
