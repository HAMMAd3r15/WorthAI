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
        zIndex: position === "front" ? "3" : position === "middle" ? "2" : "1",
        perspective: "1000px"
      }}
      animate={{
        rotateY: position === "front" ? "0deg" : position === "middle" ? "-15deg" : "-30deg",
        x: position === "front" ? "0%" : position === "middle" ? "40%" : "80%",
        z: position === "front" ? 0 : position === "middle" ? -100 : -200,
        scale: position === "front" ? 1 : position === "middle" ? 0.9 : 0.8,
        opacity: position === "front" ? 1 : position === "middle" ? 0.7 : 0.4,
        rotateZ: position === "front" ? "-4deg" : position === "middle" ? "0deg" : "4deg",
      }}
      drag={isFront ? "x" : false}
      dragElastic={0.35}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
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
        stiffness: 180,
        damping: 24 
      }}
      className={`absolute left-0 top-0 flex flex-col items-center justify-center h-[480px] w-[320px] md:w-[360px] select-none space-y-10 rounded-[40px] border border-white/5 bg-[#0D1117]/40 backdrop-blur-[40px] p-12 transition-colors duration-500 shadow-2xl ${
        isFront 
          ? "cursor-grab active:cursor-grabbing border-primary/20 shadow-[0_0_50px_-12px_rgba(201,168,76,0.1)]" 
          : "pointer-events-none"
      }`}
    >
      {/* Orbital Icon Container */}
      <div className="relative group/icon">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border border-dashed border-primary/10 rounded-full opacity-50" 
        />
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700" />
        
        <div className="relative w-28 h-28 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[32px] items-center justify-center flex border border-white/10 shadow-inner group-hover/icon:border-primary/30 transition-colors duration-500 overflow-hidden">
          {/* Subtle inner reflection */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Icon className="w-12 h-12 text-primary drop-shadow-[0_0_12px_rgba(201,168,76,0.4)] group-hover/icon:scale-110 transition-transform duration-500" />
        </div>
      </div>

      <div className="text-center space-y-5">
        <h3 className="text-xl font-josefin font-bold text-white uppercase tracking-[0.35em] leading-tight">
          {title}
        </h3>
        <div className="h-px w-12 bg-primary/20 mx-auto" />
        <p className="text-secondary/70 text-[15px] leading-relaxed font-josefin font-medium px-4">
          {description}
        </p>
      </div>

      {isFront && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2.5">
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  scale: i === index ? 1.2 : 1,
                  backgroundColor: i === index ? "rgba(201, 168, 76, 1)" : "rgba(255, 255, 255, 0.1)"
                }}
                className="w-1.5 h-1.5 rounded-full" 
              />
            ))}
          </div>
          <span className="text-[9px] font-black text-secondary/40 uppercase tracking-[0.4em]">Swipe to flip</span>
        </div>
      )}
    </motion.div>
  );
}
