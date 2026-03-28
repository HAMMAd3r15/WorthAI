"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FinancialItem = { label: string; amount: number }

export function OnboardingFlow() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    fetchProfile()
  }, [supabase])

  const isPro = profile?.plan === 'pro'

  const [income, setIncome] = useState<FinancialItem[]>([{ label: "", amount: 0 }])
  const [expenses, setExpenses] = useState<FinancialItem[]>([{ label: "", amount: 0 }])
  const [savings, setSavings] = useState(0)
  const [debts, setDebts] = useState<FinancialItem[]>([])

  const totalSteps = 4

  const addItem = (setter: any) => setter((prev: any) => [...prev, { label: "", amount: 0 }])
  const removeItem = (setter: any, index: number) => setter((prev: any) => prev.filter((_: any, i: number) => i !== index))
  const updateItem = (setter: any, index: number, field: string, value: any) => setter((prev: any) => {
    const next = [...prev]
    next[index] = { ...next[index], [field]: value }
    return next
  })

  const handleComplete = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      try {
        // 1. Create Profile
        const { data: pData, error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: user.id, plan: 'free' }, { onConflict: 'id' })
          .select()
        console.log("Upsert Profile Result:", { data: pData, error: profileError })
        if (profileError) throw profileError

        // 2. Save Financial Profile


        const { data: fData, error: finError } = await supabase
          .from('financial_profiles')
          .upsert({
            user_id: user.id,
            income_sources: income.filter(i => i.label),
            expenses: expenses.filter(i => i.label),
            savings: savings,
            debts: debts.filter(i => i.label),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
          .select()
        console.log("Upsert Financial Profile Result:", { data: fData, error: finError })
        if (finError) throw finError



        // Success - small delay before redirect to ensure state is persisted
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } catch (err: any) {
        alert("Wait, we couldn't save your profile: " + (err.message || "Unknown error"))
      }
    } else {
      alert("No user found. Please log in again.")
    }
    setLoading(false)
  }

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const inputClass = "w-full bg-[#0D1117] border border-white/5 p-4 text-sm focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 outline-none transition-all rounded-lg"
  const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`
  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-[#C9A84C]"
  const addBtnClass = "w-full py-4 border border-dashed border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5 text-sm flex items-center justify-center gap-2 transition-all rounded-lg font-medium"
  const cardClass = "p-12 bg-[#111827] border-[#C9A84C]/20 hover:border-[#C9A84C]/40 rounded-2xl"
  const nextBtnClass = "w-10 h-10 p-0 rounded-full"

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="mb-10 flex items-center gap-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'bg-white/5'}`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <Card className={cardClass}>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Monthly Income</h2>
              <p className="text-secondary text-base mb-10 opacity-80">Add all your recurring income sources.</p>
              
              <div className="space-y-4 mb-8">
                {income.map((item, i) => (
                  <div key={i} className="flex gap-6 items-end">
                    <div className="flex-1 space-y-2">
                      <label className={labelClass}>Source Label</label>
                      <input 
                        value={item.label}
                        onChange={e => updateItem(setIncome, i, 'label', e.target.value)}
                        placeholder="e.g. Salary, Freelance"
                        className={inputClass}
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <label className={labelClass}>Amount ($)</label>
                      <input 
                        type="number"
                        value={item.amount === 0 ? "" : item.amount}
                        onChange={e => updateItem(setIncome, i, 'amount', Number(e.target.value))}
                        placeholder="0"
                        className={numberInputClass}
                      />
                    </div>
                    {income.length > 1 && (
                      <button onClick={() => removeItem(setIncome, i)} className="p-4 text-secondary hover:text-danger transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {isPro ? (
                  <button onClick={() => addItem(setIncome)} className={addBtnClass}>
                    <Plus className="w-4 h-4" /> Add Another Source
                  </button>
                ) : (
                  <p className="text-[11px] text-secondary/50 mt-2 flex items-center gap-1.5">
                    Multiple income sources available on 
                    <span className="text-white/40 font-medium">Pro</span>
                    <Link href="/#pricing" className="text-[#C9A84C] hover:text-[#D4B96A] font-bold underline underline-offset-4 ml-1 transition-colors">Upgrade</Link>
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextStep} size="sm" className={nextBtnClass}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className={cardClass}>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Monthly Expenses</h2>
              <p className="text-secondary text-base mb-10 opacity-80">Rent, food, transport, subscriptions, etc.</p>
              
              <div className="space-y-4 mb-8">
                {expenses.map((item, i) => (
                  <div key={i} className="flex gap-6 items-end">
                    <div className="flex-1 space-y-2">
                      <label className={labelClass}>Expense Name</label>
                      <input 
                        value={item.label}
                        onChange={e => updateItem(setExpenses, i, 'label', e.target.value)}
                        placeholder="e.g. Rent, Groceries"
                        className={inputClass}
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <label className={labelClass}>Amount ($)</label>
                      <input 
                        type="number"
                        value={item.amount === 0 ? "" : item.amount}
                        onChange={e => updateItem(setExpenses, i, 'amount', Number(e.target.value))}
                        placeholder="0"
                        className={numberInputClass}
                      />
                    </div>
                    {expenses.length > 1 && (
                      <button onClick={() => removeItem(setExpenses, i)} className="p-4 text-secondary hover:text-danger transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addItem(setExpenses)} className={addBtnClass}>
                  <Plus className="w-4 h-4" /> Add Another Expense
                </button>
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={prevStep} size="sm" className={nextBtnClass}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={nextStep} size="sm" className={nextBtnClass}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className={cardClass}>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Total Savings</h2>
              <p className="text-secondary text-base mb-10 opacity-80">How much do you have set aside? (Optional)</p>
              
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className={labelClass}>Total Cash/Savings ($)</label>
                  <input 
                    type="number"
                    value={savings === 0 ? "" : savings}
                    onChange={e => setSavings(Number(e.target.value))}
                    placeholder="0"
                    className={`w-full bg-[#0D1117] border border-white/5 p-6 text-4xl font-bold focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 outline-none transition-all rounded-lg text-[#C9A84C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={prevStep} size="sm" className={nextBtnClass}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={nextStep} size="sm" className={nextBtnClass}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card className={cardClass}>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Any Debts?</h2>
              <p className="text-secondary text-base mb-10 opacity-80">Student loans, credit cards, car loans, etc. (Optional)</p>
              
              <div className="space-y-4 mb-8">
                {debts.map((item, i) => (
                  <div key={i} className="flex gap-6 items-end">
                    <div className="flex-1 space-y-2">
                      <label className={labelClass}>Debt Label</label>
                      <input 
                        value={item.label}
                        onChange={e => updateItem(setDebts, i, 'label', e.target.value)}
                        placeholder="e.g. Student Loan"
                        className={inputClass}
                      />
                    </div>
                    <div className="w-40 space-y-2">
                      <label className={labelClass}>Remaining Bal. ($)</label>
                      <input 
                        type="number"
                        value={item.amount === 0 ? "" : item.amount}
                        onChange={e => updateItem(setDebts, i, 'amount', Number(e.target.value))}
                        placeholder="0"
                        className={numberInputClass}
                      />
                    </div>
                    <button onClick={() => removeItem(setDebts, i)} className="p-4 text-secondary hover:text-danger transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addItem(setDebts)} className={addBtnClass}>
                  <Plus className="w-4 h-4" /> Add a Debt
                </button>
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={prevStep} size="sm" className={nextBtnClass}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={handleComplete} disabled={loading} size="sm" className={nextBtnClass}>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
