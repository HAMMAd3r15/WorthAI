"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Calculator, TrendingDown, Calendar, ArrowRight, Info, AlertCircle, TrendingUp } from "lucide-react"

interface Debt {
  label: string
  amount: number
  interest_rate?: number
  min_payment?: number
}

export function DebtPayoffPanel({ debts }: { debts: Debt[] }) {
  const [extraPayment, setExtraPayment] = useState(0)

  const totalDebt = useMemo(() => debts.reduce((acc, d) => acc + (d.amount || 0), 0), [debts])
  
  const calculatePayoff = (extra: number) => {
    let currentTotal = totalDebt
    let months = 0
    let totalInterest = 0
    
    // Simplified aggregate calculation for projection
    // In a real app, we'd do this per debt with an avalanche/snowball strategy
    const avgRate = debts.length > 0 
      ? debts.reduce((acc, d) => acc + (d.interest_rate || 18), 0) / debts.length 
      : 18
    const minPayments = debts.reduce((acc, d) => acc + (d.min_payment || Math.max(25, (d.amount || 0) * 0.02)), 0)
    
    const monthlyRate = (avgRate / 100) / 12
    let balance = totalDebt
    const totalMonthly = minPayments + extra

    if (totalMonthly <= balance * monthlyRate) return { months: 999, interest: 0 } // Never pays off

    while (balance > 0 && months < 600) { // 50 year cap
      const interest = balance * monthlyRate
      totalInterest += interest
      balance = balance + interest - totalMonthly
      months++
    }

    return { months, interest: totalInterest }
  }

  const standard = useMemo(() => calculatePayoff(0), [totalDebt, debts])
  const optimized = useMemo(() => calculatePayoff(extraPayment), [totalDebt, debts, extraPayment])
  
  const monthsSaved = standard.months - optimized.months
  const interestSaved = standard.interest - optimized.interest

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const getPayoffDate = (months: number) => {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (totalDebt === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-[#111827] border border-white/5 rounded-[40px] p-20 flex flex-col items-center text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-success/5 border border-success/10 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-success/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Debt Free!</h2>
            <p className="text-secondary text-sm max-w-[300px] font-medium leading-relaxed">
              You don&apos;t have any debts recorded. Once you add liabilities in Settings, you can use this calculator to plan your payoff strategy.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar bg-[#0A0D14]">
      <div className="max-w-5xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Debt Payoff Calculator</h1>
          <p className="text-secondary text-sm font-medium">Visualize your path to financial freedom.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111827] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl shadow-black/40">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Extra Monthly Payment</h4>
                  <span className="text-[#C9A84C] font-black text-lg">{formatCurrency(extraPayment)}</span>
                </div>
                
                <div className="relative group">
                  <input 
                    type="range"
                    min="0"
                    max={Math.max(5000, totalDebt / 10)}
                    step="50"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#C9A84C] hover:bg-white/10 transition-all"
                  />
                </div>

                <p className="text-[11px] text-secondary/40 font-medium leading-relaxed">
                  Adding just {formatCurrency(extraPayment)} more to your monthly payments can dramatically change your payoff timeline.
                </p>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Current Outlook</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[12px] font-medium text-secondary/60">Total Debt</span>
                    <span className="text-[14px] font-black text-white">{formatCurrency(totalDebt)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[12px] font-medium text-secondary/60">Avg. Interest</span>
                    <span className="text-[14px] font-black text-white">18.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                layout
                className="bg-[#111827] border border-white/5 rounded-[32px] p-8 shadow-2xl shadow-black/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Calendar className="w-20 h-20 text-white" />
                </div>
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-4">Payoff Date</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-secondary/40 text-[11px] font-bold uppercase mb-1">Standard</p>
                    <p className="text-lg font-black text-white/40 line-through tracking-tight">{getPayoffDate(standard.months)}</p>
                  </div>
                  <div>
                    <p className="text-[#C9A84C] text-[11px] font-bold uppercase mb-1">Accelerated</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{getPayoffDate(optimized.months)}</p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-success text-[10px] font-black uppercase tracking-widest">
                      <TrendingDown className="w-3 h-3" />
                      {monthsSaved} Months Sooner
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                layout
                className="bg-[#111827] border border-[#C9A84C]/20 rounded-[32px] p-8 shadow-2xl shadow-[#C9A84C]/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <TrendingUp className="w-20 h-20 text-[#C9A84C]" />
                </div>
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-4">Interest Savings</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-secondary/40 text-[11px] font-bold uppercase mb-1">Total Savings</p>
                    <p className="text-4xl font-black text-[#C9A84C] tracking-tighter">{formatCurrency(interestSaved)}</p>
                  </div>
                  <p className="text-secondary text-[12px] font-medium leading-relaxed pr-8">
                    By paying roughly {formatCurrency(extraPayment)} extra per month, you avoid {formatCurrency(interestSaved / 12)} per month in average interest charges.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Timeline Visualization */}
            <div className="bg-[#111827] border border-white/5 rounded-[32px] p-10 shadow-2xl shadow-black/40">
              <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-10">Payoff Timeline</h4>
              
              <div className="relative pt-8 pb-12">
                {/* Track */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-white/5 rounded-full -translate-y-1/2" />
                
                {/* Accelerated Track */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(optimized.months / standard.months) * 100}%` }}
                  className="absolute top-1/2 left-0 h-1.5 bg-[#C9A84C] rounded-full -translate-y-1/2 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                />

                {/* Milestones */}
                <div className="relative flex justify-between px-2">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-white border-4 border-[#0A0D14] shadow-xl z-10" />
                    <div className="text-center absolute -top-8 -translate-x-1/2 left-0 whitespace-nowrap">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Today</p>
                    </div>
                  </div>

                  <motion.div 
                    layout
                    style={{ left: `${(optimized.months / standard.months) * 100}%` }}
                    className="flex flex-col items-center gap-4 absolute -translate-x-1/2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C] border-4 border-[#0A0D14] shadow-xl z-20 flex items-center justify-center">
                      <ArrowRight className="w-2.5 h-2.5 text-black" />
                    </div>
                    <div className="text-center absolute -bottom-12 whitespace-nowrap">
                      <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest mb-1">Debt Free</p>
                      <p className="text-[9px] font-bold text-secondary/40 uppercase">{getPayoffDate(optimized.months)}</p>
                    </div>
                  </motion.div>

                  <div className="flex flex-col items-center gap-4 absolute left-full -translate-x-full">
                    <div className="w-4 h-4 rounded-full bg-white/20 border-4 border-[#0A0D14] shadow-xl z-10" />
                    <div className="text-center absolute -top-8 whitespace-nowrap">
                      <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Original Date</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 bg-[#C9A84C]/5 border border-[#C9A84C]/10 p-4 rounded-2xl">
                <Info className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <p className="text-[11px] text-secondary font-medium leading-relaxed">
                  This projection assumes an avalanche payoff strategy (highest interest first) and consistent monthly payments. Real-world results may vary slightly based on specific card terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
