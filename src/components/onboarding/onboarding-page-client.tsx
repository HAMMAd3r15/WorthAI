"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"

const AetherFlowBackground = dynamic(
  () => import("@/components/ui/aether-flow-background").then(mod => mod.AetherFlowBackground),
  { ssr: false }
)

const OnboardingFlow = dynamic(
  () => import("@/components/onboarding/onboarding-flow").then(mod => mod.OnboardingFlow),
  { ssr: false }
)

export function OnboardingPageClient() {
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false })

  useEffect(() => {
    const msg = sessionStorage.getItem('onboarding_toast')
    if (msg) {
      setToast({ message: msg, show: true })
      sessionStorage.removeItem('onboarding_toast')
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 relative overflow-hidden">
      <AetherFlowBackground />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-[#C9A84C] text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-white/20 whitespace-nowrap"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-[0.2em] text-[#C9A84C]">WorthAI</h1>
      </div>
      <div className="relative z-10">
        <OnboardingFlow />
      </div>
    </div>
  )
}
