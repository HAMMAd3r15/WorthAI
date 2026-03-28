"use client";

import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 10,
}: TestimonialsColumnProps) => {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, name, role }, i) => (
              <div 
                className="p-8 rounded-2xl border border-white/5 bg-[#11141D] shadow-[0_0_20px_rgba(201,168,76,0.03)] max-w-xs w-full group hover:border-primary/30 transition-colors duration-500" 
                key={i}
              >
                <div className="text-secondary/80 leading-relaxed font-josefin italic text-[15px]">
                  "{text}"
                </div>
                <div className="flex flex-col mt-6">
                  <div className="font-josefin font-bold tracking-tight leading-5 text-white">
                    {name}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/60 mt-1">
                    {role}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
