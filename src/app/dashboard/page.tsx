"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { FinanceModal } from "@/components/dashboard/finance-modal"
import { useModals } from "@/components/providers/modal-provider"
import { Settings, LogOut, CheckCircle2 } from "lucide-react"
import { WorthLogo } from "@/components/ui/worth-logo"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { DataProvider, useData } from "@/components/providers/data-provider"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile, financial, refreshData } = useData()
  const { openPricing } = useModals()
  
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

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0A0D14] overflow-hidden text-foreground">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0A0D14] z-50">
        <div className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-all">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
            <WorthLogo className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">WorthAI</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-secondary hover:text-[#C9A84C]"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <button 
            onClick={handleLogoutClick}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-secondary hover:text-danger"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col min-h-0">
          <div className="flex-1 border border-white/5 rounded-[32px] overflow-hidden bg-[#0D1117]/50 backdrop-blur-sm flex flex-col">
             <ChatInterface />
          </div>
        </div>
      </main>

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
