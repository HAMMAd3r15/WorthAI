"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { ModalProvider } from "@/components/providers/modal-provider"
import { DataProvider, useData } from "@/components/providers/data-provider"

function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { profile, refreshData } = useData()
  
  return (
    <ModalProvider profile={profile} onUpgradeSuccess={refreshData}>
      <div className="flex min-h-screen bg-[#0A0D14] text-foreground font-josefin">
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </ModalProvider>
  )
}

export function ClientLayout({
  children,
  initialFinancial,
  initialProfile
}: {
  children: React.ReactNode
  initialFinancial: any
  initialProfile: any
}) {
  return (
    <DataProvider initialProfile={initialProfile} initialFinancial={initialFinancial}>
       <DashboardWrapper>{children}</DashboardWrapper>
    </DataProvider>
  )
}
