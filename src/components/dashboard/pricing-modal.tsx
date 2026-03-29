"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function PricingModal({
  profile,
  onClose,
  onSuccess
}: {
  profile: any,
  onClose: () => void,
  onSuccess: () => void
}) {
  const supabase = createClient()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleUpgrade = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', user.id)

      if (!error) {
        onSuccess()
        onClose()
      } else {
        alert("Error upgrading: " + error.message)
      }
    }
    setLoading(false)
  }

  const freeFeatures = [
    "5 AI questions per day",
    "Single income source",
    "Basic expense tracking",
    "Standard AI personality"
  ]

  const proFeatures = [
    "Unlimited AI questions",
    "Multiple income sources",
    "All chats reports",
    "Priority response speed",
    "Ad-free experience"
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-white/5 rounded-full transition-colors z-10">
          <X className="w-5 h-5 text-secondary" />
        </button>

        <div className="p-12 md:p-16 flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 text-center">Choose Your Plan</h2>
          <p className="text-secondary text-base mb-12 text-center max-w-md">Upgrade anytime. Cancel anytime. Take full control of your net worth today.</p>

          {/* Toggle */}
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl mb-16 relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-secondary hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-black' : 'text-secondary hover:text-white'}`}
            >
              Yearly
              <span className="px-1.5 py-0.5 bg-[#C9A84C]/20 text-[#C9A84C] text-[8px] font-black rounded uppercase">-17%</span>
            </button>
            <motion.div
              layoutId="cycle-bg"
              className="absolute inset-y-1 bg-[#C9A84C] rounded-xl z-0 shadow-lg shadow-[#C9A84C]/20"
              initial={false}
              animate={{
                x: billingCycle === 'monthly' ? 4 : 108,
                width: billingCycle === 'monthly' ? 95 : 105
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Free Plan */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-10 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-start h-full transition-colors hover:border-white/10"
            >
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-secondary text-sm">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-secondary">
                    <Check className="w-4 h-4 text-secondary/30 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {profile?.plan === 'free' ? (
                <Button disabled className="w-full h-14 bg-white/10 text-white font-bold text-base rounded-2xl opacity-50 cursor-not-allowed">
                  Current Plan
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-14 border-white/10 text-white font-bold text-base rounded-2xl hover:bg-white/5">
                  Downgrade
                </Button>
              )}
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-10 bg-white/[0.03] border-2 border-[#C9A84C] rounded-3xl flex flex-col items-start h-full relative group"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#C9A84C] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-[#C9A84C]/20">
                Recommended
              </div>
              <div className="absolute inset-0 bg-[#C9A84C]/5 rounded-3xl opacity-0 transition-opacity group-hover:opacity-100" />

              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">
                  ${billingCycle === 'monthly' ? '10' : '100'}
                </span>
                <span className="text-secondary text-sm">
                  {billingCycle === 'monthly' ? '/month' : '/year'}
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-1 relative z-10">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="w-full relative z-10">
                <Button
                  onClick={handleUpgrade}
                  disabled={loading || profile?.plan === 'pro'}
                  className="w-full h-14 bg-[#C9A84C] text-black font-extrabold text-lg rounded-2xl shadow-xl shadow-[#C9A84C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : profile?.plan === 'pro' ? "Current Plan" : "Upgrade to Pro"}
                </Button>
                <p className="mt-4 text-[11px] text-secondary text-center italic opacity-60 font-bold">
                  Test mode — simulating Pro upgrade
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
