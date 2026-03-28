"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, CreditCard, Wallet, Trash2, Pencil, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DeleteAccountModal } from "./delete-account-modal"

export function SettingsPanel({ 
  profile, 
  onClose,
  onOpenFinance,
  onOpenPricing
}: { 
  profile: any, 
  onClose: () => void,
  onOpenFinance: () => void,
  onOpenPricing: () => void
}) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const supabase = createClient()

  const confirmDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  return (
    <>
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteAccountModal 
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111827] border-l border-white/5 z-[101] shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Profile Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#C9A84C]">
              <User className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Profile</h3>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-2xl space-y-4 border border-white/5">
              <div>
                <label className="text-[10px] font-bold uppercase text-secondary/50 block mb-1">Email</label>
                <p className="text-sm font-medium text-white/90">{profile?.email || 'Loading...'}</p>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-[11px] text-danger/60 hover:text-danger transition-colors font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>
            </div>
          </section>

          {/* Finances Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#C9A84C]">
              <Wallet className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">My Finances</h3>
            </div>
            <button 
              onClick={() => {
                onClose()
                onOpenFinance()
              }}
              className="w-full group p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#C9A84C]/30 transition-all text-left flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Edit Financial Info</p>
                <p className="text-[10px] text-secondary/60">Income, Expenses, Savings, Debts</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:text-black transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </div>
            </button>
          </section>

          {/* Subscription Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#C9A84C]">
              <CreditCard className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Subscription</h3>
            </div>
            <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-bold uppercase text-secondary/50 block mb-1">Current Plan</label>
                  <p className="text-2xl font-black capitalize text-white">{profile?.plan || 'Free'}</p>
                </div>
                {profile?.plan === 'pro' && (
                  <span className="px-2 py-0.5 bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] font-bold rounded uppercase">Active</span>
                )}
              </div>
              
              <button 
                onClick={() => {
                  onClose()
                  onOpenPricing()
                }}
                className="w-full py-4 bg-[#C9A84C] text-black text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-[#D4B96A] transition-all flex items-center justify-center gap-2"
              >
                {profile?.plan === 'free' ? 'View Plans' : 'Manage Subscription'}
                <ExternalLink className="w-3 h-3" />
              </button>
              
              {profile?.plan === 'free' && (
                <p className="text-[11px] text-secondary/60 italic text-center leading-relaxed">
                  Upgrade to unlock unlimited AI questions and multiple income sources.
                </p>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </>
  )
}
