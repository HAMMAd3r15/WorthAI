"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DataContextType {
  profile: any
  financial: any
  loading: boolean
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ 
  children, 
  initialProfile, 
  initialFinancial 
}: { 
  children: ReactNode, 
  initialProfile: any, 
  initialFinancial: any 
}) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState(initialProfile)
  const [financial, setFinancial] = useState(initialFinancial)
  const [loading, setLoading] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const [pRes, fRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('financial_profiles').select('*').eq('user_id', user.id).single()
      ])
      
      if (pRes.data) {
        setProfile({ ...pRes.data, email: user.email })
      }
      if (fRes.data) {
        setFinancial(fRes.data)
      }
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <DataContext.Provider value={{ profile, financial, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
