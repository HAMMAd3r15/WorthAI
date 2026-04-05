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

export function DebtPayoffPanel({ debts, monthlySurplus }: { debts: Debt[], monthlySurplus: number }) {
  const [surplusContribution, setSurplusContribution] = useState(0)
  const [manualInterestRate, setManualInterestRate] = useState(0)

  const totalDebt = useMemo(() => debts.reduce((acc, d) => acc + (d.amount || 0), 0), [debts])
  const isOverSurplus = surplusContribution > monthlySurplus
  
  const calculatePayoff = (extra: number, interestRate: number) => {
    let currentTotal = totalDebt
    let months = 0
    let totalInterest = 0
    
    // Use user-provided interest rate or default to 0
    const annualRate = interestRate || 0
    const minPayments = debts.reduce((acc, d) => acc + (d.min_payment || Math.max(25, (d.amount || 0) * 0.02)), 0)
    
    const monthlyRate = (annualRate / 100) / 12
    let balance = totalDebt
    const totalMonthly = minPayments + extra

    // If payments don't cover interest, it never pays off
    if (monthlyRate > 0 && totalMonthly <= balance * monthlyRate) return { months: 999, interest: 0 } 

    while (balance > 0 && months < 600) { // 50 year cap
      const interest = balance * monthlyRate
      totalInterest += interest
      balance = balance + interest - totalMonthly
      months++
    }

    return { months, interest: totalInterest }
  }

  const standard = useMemo(() => calculatePayoff(0, manualInterestRate), [totalDebt, manualInterestRate])
  const optimized = useMemo(() => calculatePayoff(surplusContribution, manualInterestRate), [totalDebt, surplusContribution, manualInterestRate])
  
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
    if (months >= 600) return "Never"
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
              
              {/* Surplus Contribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Surplus Contribution</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isOverSurplus ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                    Available: {formatCurrency(monthlySurplus)}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 font-bold">$</div>
                  <input 
                    type="number"
                    value={surplusContribution || ''}
                    onChange={(e) => setSurplusContribution(Number(e.target.value))}
                    placeholder="0"
                    className={`w-full bg-white/5 border ${isOverSurplus ? 'border-danger/50 focus:border-danger' : 'border-white/5 focus:border-[#C9A84C]'} rounded-2xl py-4 pl-8 pr-4 text-white font-bold outline-none transition-all placeholder:text-white/10`}
                  />
                </div>

                {isOverSurplus && (
                  <div className="flex items-center gap-2 text-danger text-[10px] font-bold bg-danger/5 p-3 rounded-xl border border-danger/10">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Contribution exceeds your monthly surplus of {formatCurrency(monthlySurplus)}</span>
                  </div>
                )}
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Annual Interest Rate</h4>
                <div className="relative">
                  <input 
                    type="number"
                    value={manualInterestRate || ''}
                    onChange={(e) => setManualInterestRate(Number(e.target.value))}
                    placeholder="0"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/5 focus:border-[#C9A84C] rounded-2xl py-4 px-4 text-white font-bold outline-none transition-all placeholder:text-white/10"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 font-bold">%</div>
                </div>
                <p className="text-[10px] text-secondary/40 font-medium">Leave at 0 if you don&apos;t want to include interest.</p>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Debt Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[12px] font-medium text-secondary/60">Total Amount</span>
                    <span className="text-[14px] font-black text-white">{formatCurrency(totalDebt)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[12px] font-medium text-secondary/60">Interest (Applied)</span>
                    <span className="text-[14px] font-black text-white">{manualInterestRate || 0}%</span>
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
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-4">Projected Payoff Date</p>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <p className={`text-4xl font-black ${isOverSurplus ? 'text-white/20' : 'text-white'} tracking-tighter transition-colors`}>
                      {getPayoffDate(optimized.months)}
                    </p>
                    {surplusContribution > 0 && !isOverSurplus && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest">
                          <TrendingDown className="w-3 h-3" />
                          {monthsSaved} Months Sooner
                        </span>
                        <span className="text-[10px] text-secondary/40 font-bold uppercase line-through">
                          Orig: {getPayoffDate(standard.months)}
                        </span>
                      </div>
                    )}
                    {(surplusContribution === 0 || isOverSurplus) && (
                      <p className="mt-4 text-[11px] text-secondary/40 font-medium leading-relaxed">
                        Increase your monthly surplus contribution to accelerate this date.
                      </p>
                    )}
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
                    <p className={`text-4xl font-black ${isOverSurplus ? 'text-[#C9A84C]/20' : 'text-[#C9A84C]'} tracking-tighter transition-colors`}>{isOverSurplus ? '$0' : formatCurrency(interestSaved)}</p>
                  </div>
                  <p className="text-secondary text-[12px] font-medium leading-relaxed pr-8 line-clamp-2">
                    {manualInterestRate > 0 
                      ? `By paying your surplus of ${formatCurrency(surplusContribution)} extra per month, you avoid ${formatCurrency(interestSaved)} in projected interest.`
                      : "With 0% interest, extra payments simply shorten your timeline without additional dollar savings."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Strategic Impact Section */}
            <div className={`bg-[#111827] border border-white/5 rounded-[32px] p-10 shadow-2xl shadow-black/40 ${isOverSurplus ? 'opacity-40 grayscale pointer-events-none' : ''} transition-all duration-500`}>
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">Strategic Impact Summary</h4>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                   <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest">Optimized Real-Time</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Timeline Health</p>
                    <p className="text-xl font-black text-white">{monthsSaved > 0 ? `${monthsSaved} Months Saved` : "Standard Pace"}</p>
                  </div>
                </div>

                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Interest Impact</p>
                    <p className="text-xl font-black text-white">{interestSaved > 0 ? formatCurrency(interestSaved) : "$0 Saved"}</p>
                  </div>
                </div>

                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Payoff Velocity</p>
                    <p className="text-xl font-black text-white">
                      {surplusContribution > 0 
                        ? `${(( (optimized.months / standard.months) ) * 100).toFixed(0)}% Speed`
                        : "Nominal Rate"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-start gap-4 bg-[#C9A84C]/5 border border-[#C9A84C]/10 p-6 rounded-[28px]">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-white font-bold tracking-tight">Strategy Insights</p>
                  <p className="text-[11px] text-secondary font-medium leading-relaxed">
                    {surplusContribution > 0 
                      ? `Your extra monthly contribution of ${formatCurrency(surplusContribution)} will reduce your payoff time to ${getPayoffDate(optimized.months)}. This strategy effectively compounds your wealth by removing interest burdens early.`
                      : "Consider allocating a portion of your monthly surplus to your debts. Even small extra payments can drastically reduce the long-term interest cost and shorten your timeline to financial freedom."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

