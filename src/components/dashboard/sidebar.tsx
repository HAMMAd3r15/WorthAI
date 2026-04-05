"use client"

import { WorthLogo } from "@/components/ui/worth-logo"
import { useData } from "@/components/providers/data-provider"
import { useModals } from "@/components/providers/modal-provider"
import { motion } from "framer-motion"
import { MessageSquare, Target, Calculator, FileText, TrendingUp, Wallet, CreditCard, PlusCircle } from "lucide-react"
import { SpendingBreakdown } from "./spending-breakdown"

interface SidebarProps {
  activeView: 'chat' | 'goals' | 'debt'
  onViewChange: (view: 'chat' | 'goals' | 'debt') => void
  onOpenSettings: () => void
  onLogout: () => void
  financialProfile: any
  questionsToday: number
  plan?: string
}

export function Sidebar({ 
  activeView, 
  onViewChange, 
  onOpenSettings, 
  onLogout,
  financialProfile,
  questionsToday,
  plan
}: SidebarProps) {
  const { financial } = useData()
  const { openReport } = useModals()

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

  const navItems = [
    { id: 'chat', label: 'AI Advisor', icon: MessageSquare },
    { id: 'goals', label: 'Financial Goals', icon: Target },
    { id: 'debt', label: 'Debt Payoff', icon: Calculator },
  ]

  const metrics = [
    { label: "Monthly Income", value: totalIncome, icon: Wallet, color: "#C9A84C" },
    { label: "Total Savings", value: totalSavings, icon: TrendingUp, color: "#10B981" },
    { label: "Total Debt", value: totalDebts, icon: CreditCard, color: "#EF4444" },
    { label: "Monthly Surplus", value: monthlySurplus, icon: PlusCircle, color: monthlySurplus >= 0 ? "#10B981" : "#EF4444" },
  ]

  return (
    <div className="hidden lg:flex flex-col w-[340px] shrink-0 border-r border-white/5 h-full overflow-y-auto no-scrollbar p-6 space-y-8 bg-[#0A0D14]/50">
      
      {/* Brand Header */}
      <div className="px-2 mb-2">
        <span className="text-2xl font-black tracking-tighter text-white">WorthAI</span>
      </div>

      {/* Profile Summary / Nav */}
      <div className="space-y-2">
        <h4 className="text-[9px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</h4>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`w-full flex items-center justify-between group p-3.5 rounded-2xl transition-all duration-300 relative border ${
              activeView === item.id 
                ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30 text-white' 
                : 'bg-transparent border-transparent text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 relative z-10">
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-[#C9A84C]' : 'text-secondary/60 group-hover:text-[#C9A84C]'} transition-colors`} />
              <span className="text-[14px] font-bold tracking-tight">{item.label}</span>
            </div>
            {activeView === item.id && (
              <motion.div 
                layoutId="nav-active"
                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_12px_#C9A84C]"
              />
            )}
          </button>
        ))}

        <button
          onClick={openReport}
          className="w-full flex items-center gap-3.5 group p-3.5 rounded-2xl bg-white/5 border border-white/5 text-secondary hover:bg-white/10 hover:text-white transition-all duration-300 mt-4"
        >
          <FileText className="w-5 h-5 text-secondary/60 group-hover:text-[#C9A84C] transition-colors" />
          <span className="text-[14px] font-bold tracking-tight">Monthly Report</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        </button>
      </div>

      <div className="h-px bg-white/5 mx-2" />

      {/* Metrics Grid */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-bold text-secondary/40 uppercase tracking-[0.2em] mb-4 ml-2">Quick Summary</h4>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div 
              key={metric.label}
              className="bg-[#111827] border border-white/5 p-4 rounded-2xl flex flex-col gap-2 transition-all hover:border-white/10"
            >
              <div className="flex items-center gap-2">
                <metric.icon className="w-3.5 h-3.5" style={{ color: metric.color }} />
                <span className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest">{metric.label.split(' ')[1]}</span>
              </div>
              <div>
                <p className="text-[14px] font-black text-white tracking-tight leading-none mb-0.5">{formatCurrency(metric.value)}</p>
                <p className="text-[10px] font-bold text-secondary/40 uppercase">Total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="pt-2">
        <SpendingBreakdown 
          expenses={financial?.expenses || []} 
          onOpenSettings={onOpenSettings}
        />
      </div>
    </div>
  )
}
