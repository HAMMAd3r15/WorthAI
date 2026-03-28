"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { PricingModal } from "@/components/dashboard/pricing-modal"
import { ReportModal } from "@/components/dashboard/report-modal"
import { AnimatePresence } from "framer-motion"

interface ModalContextType {
  openPricing: () => void
  closePricing: () => void
  openReport: () => void
  closeReport: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children, profile, onUpgradeSuccess }: { children: ReactNode, profile: any, onUpgradeSuccess: () => void }) {
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const openPricing = () => setIsPricingOpen(true)
  const closePricing = () => setIsPricingOpen(false)
  const openReport = () => setIsReportOpen(true)
  const closeReport = () => setIsReportOpen(false)

  return (
    <ModalContext.Provider value={{ openPricing, closePricing, openReport, closeReport }}>
      {children}
      <AnimatePresence>
        {isPricingOpen && (
          <PricingModal 
            profile={profile}
            onClose={closePricing}
            onSuccess={() => {
              onUpgradeSuccess()
              closePricing()
            }}
          />
        )}
        {isReportOpen && (
          <ReportModal 
            profile={profile}
            onClose={closeReport}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

export function useModals() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModals must be used within a ModalProvider")
  }
  return context
}
