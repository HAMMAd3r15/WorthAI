"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Sparkles, CheckCircle2 } from "lucide-react"

export function MockChat() {
  return (
    <div className="max-w-3xl mx-auto mt-20">
      <Card className="p-0 overflow-hidden bg-surface/50 backdrop-blur-sm">
        <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger/50" />
            <div className="w-3 h-3 rounded-full bg-warning/50" />
            <div className="w-3 h-3 rounded-full bg-success/50" />
          </div>
          <span className="text-sm font-medium text-secondary">Worth AI Advisor</span>
          <div className="w-8" />
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Message */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <div className="bg-white/5 p-4 rounded-lg rounded-tl-none border border-white/5 max-w-[80%]">
              <p className="text-sm">Should I buy a $8,000 car right now?</p>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex gap-4 justify-end">
            <div className="bg-primary/5 p-4 rounded-lg rounded-tr-none border border-primary/20 max-w-[80%]">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-warning text-black">
                  Not Yet
                </span>
                <span className="text-[12px] font-medium text-primary flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Worth AI
                </span>
              </div>
              <p className="text-sm mb-4 leading-relaxed">
                Based on your current numbers, buying an $8,000 car would leave you with less than 2 months of emergency savings. You have a monthly surplus of $350, but your student loan interest is eating into your growth.
              </p>
              <div className="space-y-2 border-t border-primary/10 pt-4">
                <p className="text-[10px] font-bold text-primary uppercase">Action Plan</p>
                <ul className="text-[13px] text-secondary space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    Save $350 for 6 more months
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    Wait for your $1,200 bonus in June
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
