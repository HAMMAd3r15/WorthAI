"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform, animate } from "framer-motion"
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Lock,
  MinusCircle, 
  PlusCircle,
  CreditCard
} from "lucide-react"
import { useModals } from "@/components/providers/modal-provider"

function Counter({ value, prefix = "$", className = "" }: { value: number, prefix?: string, className?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1,
      onUpdate: (latest) => setDisplayValue(latest)
    })
    return () => controls.stop()
  }, [value])

  return (
    <span className={className}>
      {prefix}{Math.floor(displayValue).toLocaleString()}
    </span>
  )
}

export function Sidebar({ financial, profile }: { financial: any, profile: any }) {
  const { openPricing, openReport } = useModals()
  const totalIncome = (financial?.income_sources || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalExpenses = (financial?.expenses || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalDebts = (financial?.debts || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalSavings = financial?.savings || 0
  const monthlySurplus = totalIncome - totalExpenses

  const cardClass = "p-5 bg-[#0D1117] border border-white/5 rounded-2xl hover:border-white/10 transition-all shadow-xl"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-1.5 block opacity-60"

  const questionsLeft = Math.max(0, 5 - (profile?.questions_today || 0))

  return (
    <aside className="w-[260px] bg-[#0A0D14] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto hidden md:flex h-full">
      <div className="p-6 flex-1 flex flex-col space-y-8 mt-4">
        <div>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6 px-1">Overview</h2>
          <div className="space-y-4">
            {/* Income */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <span className={labelClass}>Income</span>
              </div>
              <Counter value={totalIncome} className="text-2xl font-bold text-[#C9A84C]" />
            </div>

            {/* Expenses */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MinusCircle className="w-4 h-4 text-secondary" />
                </div>
                <span className={labelClass}>Expenses</span>
              </div>
              <Counter value={totalExpenses} className="text-2xl font-bold text-foreground" />
            </div>

            {/* Surplus */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full ${monthlySurplus >= 0 ? 'bg-success/10' : 'bg-danger/10'} flex items-center justify-center`}>
                  <TrendingUp className={`w-4 h-4 ${monthlySurplus >= 0 ? 'text-success' : 'text-danger'}`} />
                </div>
                <span className={labelClass}>Monthly Surplus</span>
              </div>
              <Counter 
                value={monthlySurplus} 
                className={`text-2xl font-bold ${monthlySurplus >= 0 ? 'text-success' : 'text-danger'}`} 
              />
            </div>
          </div>
        </div>

        {/* Report Button */}
        <div className="px-1 mt-2">
          <button 
            onClick={openReport}
            className={`w-full group relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 ${
              profile?.plan === 'pro' 
                ? 'bg-[#C9A84C]/5 border-[#C9A84C]/20 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 active:scale-[0.98]' 
                : 'bg-white/5 border-white/5 opacity-50 hover:bg-white/10 active:scale-[0.98] group'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                profile?.plan === 'pro' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-white/5 text-secondary/40'
              }`}>
                {profile?.plan === 'pro' ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <span className={`text-[11px] font-black uppercase tracking-widest block transition-colors ${
                  profile?.plan === 'pro' ? 'text-white' : 'text-secondary/60'
                }`}>Report</span>
                <span className="text-[9px] text-secondary font-medium opacity-50 block uppercase tracking-tighter italic">
                  {profile?.plan === 'pro' ? 'AI Health Audit' : 'Unlock with Pro'}
                </span>
              </div>
              
              {profile?.plan !== 'pro' && (
                <div className="ml-auto px-1.5 py-0.5 bg-[#C9A84C] text-black text-[8px] font-black rounded uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(201,168,76,0.2)]">
                  PRO
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="pt-2 border-t border-white/5">
          <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6 mt-6 px-1">Total Assets</h2>
          <div className="space-y-6 px-1">
            <div className="flex justify-between items-center group cursor-default">
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-secondary group-hover:text-success transition-colors" />
                <span className="text-xs text-secondary font-medium">Savings</span>
              </div>
              <Counter value={totalSavings} className="text-sm font-bold text-success" />
            </div>
            
            <div className="flex justify-between items-center group cursor-default">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-secondary group-hover:text-danger transition-colors" />
                <span className="text-xs text-secondary font-medium">Total Debts</span>
              </div>
              <Counter value={totalDebts} className="text-sm font-bold text-danger" />
            </div>
          </div>


        </div>

        {/* Usage / Quota */}
        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="px-1">
             <span className={labelClass}>Usage</span>
             <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20 shadow-lg shadow-[#C9A84C]/5">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-tight">
                    {profile?.plan === 'pro' ? 'Unlimited Advice' : `${questionsLeft} of 5 left`}
                  </p>
                  <p className="text-[10px] text-secondary font-medium opacity-50 uppercase tracking-wider">
                    {profile?.plan === 'pro' ? 'Pro Member' : 'Daily AI Questions'}
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
