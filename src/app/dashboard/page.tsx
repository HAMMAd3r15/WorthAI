"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { FinanceModal } from "@/components/dashboard/finance-modal"
import { Sidebar } from "@/components/dashboard/sidebar"
import { GoalsPanel } from "@/components/dashboard/goals-panel"
import { DebtPayoffPanel } from "@/components/dashboard/debt-payoff-panel"
import { useModals } from "@/components/providers/modal-provider"
import { Settings, LogOut, CheckCircle2, MessageSquare, Target, Calculator } from "lucide-react"
import { WorthLogo } from "@/components/ui/worth-logo"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { useData } from "@/components/providers/data-provider"
import { useCurrency } from "@/context/CurrencyContext"
import { formatAmount } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile, financial, refreshData } = useData()
  const { openPricing } = useModals()
  const { symbol } = useCurrency()
  
  const [activeView, setActiveView] = useState<'chat' | 'goals' | 'debt'>('chat')
  
  // Modals
  const [showSettings, setShowSettings] = useState(false)
  const [showFinanceModal, setShowFinanceModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  // Toast
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false })

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const showSuccessToast = (msg: string) => {
    setToast({ message: msg, show: true })
  }

  if (!profile || !financial) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0A0D14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
          <p className="text-secondary text-xs uppercase tracking-widest font-bold">Relinking Data...</p>
        </div>
      </div>
    )
  }

  const mobileTabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'debt', label: 'Payoff', icon: Calculator },
  ]

  const totalIncome = (financial?.income_sources || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const totalExpenses = (financial?.expenses || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)
  const monthlySurplus = totalIncome - totalExpenses

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#0A0D14] overflow-hidden text-foreground">
      {/* Mobile Navigation and Summary */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/5 shrink-0">
        {/* Logo and Quick Info for Mobile */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-white">WorthAI</span>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-white/5 text-secondary"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleLogoutClick}
              className="p-2 rounded-xl bg-white/5 text-secondary"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-2">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold text-[12px] uppercase tracking-widest transition-all ${
                activeView === tab.id 
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0D14] shadow-lg shadow-[#C9A84C]/20' 
                  : 'bg-[#111827] border-white/5 text-secondary hover:border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Financial Summary Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-4 pt-2">
          {[
            { label: "Income", value: (financial?.income_sources || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0), color: "#C9A84C" },
            { label: "Savings", value: financial?.savings || 0, color: "#10B981" },
            { label: "Surplus", value: ((financial?.income_sources || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0) - (financial?.expenses || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0)), color: "#C9A84C" },
            { label: "Debts", value: (financial?.debts || []).reduce((acc: number, item: any) => acc + (item.amount || 0), 0), color: "#EF4444" },
          ].map((pill, i) => (
            <div
              key={pill.label}
              className="flex-shrink-0 bg-[#111827] border border-white/5 rounded-xl px-4 py-2 min-w-[100px]"
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-0.5">{pill.label}</p>
              <p 
                className="text-[14px] font-black tracking-tight"
                style={{ color: pill.color }}
              >
                {formatAmount(pill.value, symbol)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          onOpenSettings={() => setShowSettings(true)}
          onLogout={handleLogoutClick}
          financialProfile={financial}
          questionsToday={profile?.questions_today || 0}
          plan={profile?.plan}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0D14]">
          {/* Desktop Navbar Actions */}
          <header className="hidden lg:flex h-20 shrink-0 items-center justify-end px-12 gap-2 z-50">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-2xl hover:bg-white/5 transition-all text-secondary hover:text-[#C9A84C] group"
              title="Settings"
            >
              <Settings className="w-5 h-5 transform group-hover:rotate-45 transition-all duration-300" />
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button 
              onClick={handleLogoutClick}
              className="p-3 rounded-2xl hover:bg-white/5 transition-all text-secondary hover:text-red-500 group"
              title="End Session"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              {activeView === 'chat' && (
                <div className="flex-1 max-w-5xl w-full mx-auto lg:p-6 flex flex-col min-h-0">
                  <div className="flex-1 lg:border lg:border-white/5 lg:rounded-[32px] overflow-hidden lg:bg-[#0D1117]/50 lg:backdrop-blur-sm flex flex-col">
                    <ChatInterface />
                  </div>
                </div>
              )}

              {activeView === 'goals' && (
                <GoalsPanel userId={profile.id} />
              )}

              {activeView === 'debt' && (
                <DebtPayoffPanel 
                  debts={financial.debts || []} 
                  monthlySurplus={monthlySurplus} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[380px] bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <LogOut className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-white tracking-tight mb-1">End Session</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed">
                      You will be signed out of your Worth account. Any unsaved changes will be lost.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/5 mb-6" />

                <div className="flex gap-3 justify-end">
                  <motion.button 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-5 h-11 rounded-xl bg-white/5 text-white/70 text-[12px] font-semibold tracking-wide transition-all border border-white/5 hover:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ backgroundColor: "#b91c1c" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmLogout}
                    className="px-5 h-11 rounded-xl bg-red-600/90 text-white text-[12px] font-semibold tracking-wide transition-all"
                  >
                    Sign Out
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            profile={profile} 
            onClose={() => setShowSettings(false)}
            onOpenFinance={() => setShowFinanceModal(true)}
            onOpenPricing={openPricing}
          />
        )}
      </AnimatePresence>

      {/* Finance Modal */}
      <AnimatePresence>
        {showFinanceModal && (
          <FinanceModal 
            profile={profile}
            financial={financial}
            onClose={() => setShowFinanceModal(false)}
            onSuccess={() => {
              refreshData()
              showSuccessToast("Financial profile updated")
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-[#C9A84C] text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
