"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  handleShuffle: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  position: string;
  index: number;
}

export function FeatureCard({ handleShuffle, title, description, icon: Icon, position, index }: FeatureCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0",
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
        opacity: position === "front" ? 1 : position === "middle" ? 0.8 : 0.6,
      }}
      drag={isFront ? "x" : false}
      dragElastic={0.35}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX || (e.touches && e.touches[0].clientX);
      }}
      onDragEnd={(e: any) => {
        const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        if (dragRef.current - endX > 100) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className={`absolute left-0 top-0 flex flex-col items-center justify-center h-[450px] w-[320px] md:w-[350px] select-none space-y-8 rounded-[32px] border border-white/10 bg-[#0D1117]/60 backdrop-blur-2xl p-10 shadow-2xl ${
        isFront ? "cursor-grab active:cursor-grabbing border-primary/20 shadow-primary/5" : "pointer-events-none"
      }`}
    >
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-24 h-24 bg-primary/5 rounded-3xl items-center justify-center flex border border-primary/10 shadow-inner overflow-hidden">
             <Icon className="w-12 h-12 text-primary drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]" />
             {/* Decorative lines */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-josefin font-bold text-white uppercase tracking-[0.2em]">
          {title}
        </h3>
        <p className="text-secondary text-base leading-relaxed font-josefin font-medium px-4">
          {description}
        </p>
      </div>

      {isFront && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-primary' : 'bg-white/10'}`} />
            ))}
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-2">Swipe to flip</span>
        </div>
      )}
    </motion.div>
  );
};
