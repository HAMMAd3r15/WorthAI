"use client"

import { useData } from "@/components/providers/data-provider"
import { motion } from "framer-motion"

export function MobileSummaryBar() {
  const { financial } = useData()

  const totalIncome = (financial?.income_sources || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalExpenses = (financial?.expenses || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalDebts = (financial?.debts || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalSavings = financial?.savings || 0
  const monthlySurplus = totalIncome - totalExpenses

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const pills = [
    { label: "Income", value: totalIncome, color: "#C9A84C" },
    { label: "Expenses", value: totalExpenses, color: "#FFFFFF" },
    { label: "Surplus", value: monthlySurplus, color: monthlySurplus >= 0 ? "#10B981" : "#EF4444" },
    { label: "Savings", value: totalSavings, color: "#FFFFFF" },
    { label: "Debts", value: totalDebts, color: "#FFFFFF" },
  ]

  return (
    <div className="md:hidden sticky top-0 z-20 bg-[#0A0D14]/95 backdrop-blur-sm border-b border-white/5 shrink-0">
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 py-4">
        {pills.map((pill, i) => (
          <motion.div
            key={pill.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 bg-[#111827] border border-white/5 rounded-2xl px-4 py-2 min-w-[120px] shadow-lg shadow-black/20"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
              {pill.label}
            </p>
            <p 
              className="text-[16px] font-black tracking-tight"
              style={{ color: pill.color }}
            >
              {formatCurrency(pill.value)}
            </p>
          </motion.div>
        ))}
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
