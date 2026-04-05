"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Currency {
  symbol: string
  code: string
  name: string
  country: string
}

interface CurrencyContextType extends Currency {
  setCurrency: (currency: Currency) => void
  loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>({
    symbol: "$",
    code: "USD",
    name: "US Dollar",
    country: "United States"
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadCurrency() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('financial_profiles')
            .select('currency_code, currency_symbol, currency_name, country_name')
            .eq('user_id', user.id)
            .single()

          if (data && !error) {
            setCurrencyState({
              code: data.currency_code || "USD",
              symbol: data.currency_symbol || "$",
              name: data.currency_name || "US Dollar",
              country: data.country_name || "United States"
            })
          }
        }
      } catch (err) {
        console.error("Error loading currency:", err)
      } finally {
        setLoading(false)
      }
    }

    loadCurrency()
  }, [supabase])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ ...currency, setCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
