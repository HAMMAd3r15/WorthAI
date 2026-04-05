"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Save, Loader2, Crown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useCurrency } from "@/context/CurrencyContext"

type FinancialItem = { label: string; amount: number }

export function FinanceModal({ 
  profile, 
  financial, 
  onClose, 
  onSuccess 
}: { 
  profile: any, 
  financial: any, 
  onClose: () => void,
  onSuccess: () => void
}) {
  const supabase = createClient()
  const { symbol } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<{ message: string; type: 'warning' | 'error' } | null>(null)
  const isPro = profile?.plan === 'pro'

  const [formData, setFormData] = useState({
    income_sources: financial?.income_sources || [{ label: "", amount: 0 }],
    expenses: financial?.expenses || [{ label: "", amount: 0 }],
    savings: financial?.savings || 0,
    debts: financial?.debts || []
  })

  // Auto-dismiss notice
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notice])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const addItem = (field: 'income_sources' | 'expenses' | 'debts') => {
    if (field === 'income_sources' && !isPro && formData.income_sources.length >= 1) {
      setNotice({ message: "Multiple income sources require a Pro subscription.", type: 'warning' })
      return
    }
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { label: "", amount: 0 }]
    }))
  }

  const removeItem = (field: 'income_sources' | 'expenses' | 'debts', index: number) => {
    if ((field === 'income_sources' || field === 'expenses') && formData[field].length <= 1) {
      setNotice({ message: `At least one ${field === 'income_sources' ? 'income source' : 'expense'} is required.`, type: 'warning' })
      return
    }
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }))
  }

  const updateItem = (field: 'income_sources' | 'expenses' | 'debts', index: number, key: string, value: any) => {
    setFormData(prev => {
      const next = [...prev[field]]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, [field]: next }
    })
  }

  const handleSave = async () => {
    // Validation
    const hasValidIncome = formData.income_sources.some((i: { label: string, amount: number }) => i.label.trim() !== "" && i.amount > 0)
    const hasValidExpense = formData.expenses.some((i: { label: string, amount: number }) => i.label.trim() !== "" && i.amount > 0)

    if (!hasValidIncome || !hasValidExpense) {
      setNotice({ 
        message: "Please ensure you have at least one valid income source and one monthly expense with a label and amount.", 
        type: 'error' 
      })
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: fData, error: finError } = await supabase
        .from('financial_profiles')
        .upsert({
          user_id: user.id,
          income_sources: formData.income_sources.filter((i: { label: string; amount: number }) => i.label.trim() !== "" && i.amount > 0),
          expenses: formData.expenses.filter((i: { label: string; amount: number }) => i.label.trim() !== "" && i.amount > 0),
          savings: formData.savings,
          debts: formData.debts.filter((i: { label: string }) => i.label),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()

      if (!finError) {
        onSuccess()
        onClose()
      } else {
        setNotice({ message: "Failed to save changes. Please try again.", type: 'error' })
      }
    }
    setLoading(false)
  }

  const inputClass = "w-full bg-[#0D1117] border border-white/5 p-3 text-sm focus:border-[#C9A84C]/50 outline-none transition-all rounded-lg"
  const sectionLabelClass = "text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-4 pb-1 border-b border-[#C9A84C]/20 block w-fit"

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
        className="relative w-full max-w-[560px] bg-[#111827] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Your Financial Profile</h2>
            <p className="text-xs text-secondary mt-1">Updates reflect in your dashboard summary immediately.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inline Notice */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`mx-6 mt-4 px-4 py-3.5 rounded-xl border flex items-center gap-3 ${
                notice.type === 'warning' 
                  ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              {notice.type === 'warning' 
                ? <Crown className="w-4 h-4 text-[#C9A84C] shrink-0" />
                : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              }
              <p className={`text-[13px] font-semibold flex-1 ${
                notice.type === 'warning' ? 'text-[#C9A84C]' : 'text-red-400'
              }`}>
                {notice.message}
              </p>
              <button 
                onClick={() => setNotice(null)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-white/30" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Income Section */}
          <section>
            <span className={sectionLabelClass}>Monthly Income</span>
            <div className="space-y-4">
              {formData.income_sources.map((item: { label: string; amount: number }, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      placeholder="Source Label"
                      className={inputClass}
                      value={item.label}
                      onChange={e => updateItem('income_sources', i, 'label', e.target.value)}
                    />
                  </div>
                  <div className="relative w-32">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-xs">{symbol}</div>
                    <input 
                      type="number"
                      placeholder="Amount"
                      className={`${inputClass} pl-7`}
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={e => updateItem('income_sources', i, 'amount', Number(e.target.value))}
                    />
                  </div>
                  <button 
                    onClick={() => removeItem('income_sources', i)}
                    disabled={formData.income_sources.length <= 1}
                    className="p-3 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addItem('income_sources')}
                className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs text-secondary hover:border-[#C9A84C]/40 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add Income Source
              </button>
            </div>
          </section>

          {/* Expenses Section */}
          <section>
            <span className={sectionLabelClass}>Monthly Expenses</span>
            <div className="space-y-4">
              {formData.expenses.map((item: { label: string; amount: number }, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      placeholder="Expense Name"
                      className={inputClass}
                      value={item.label}
                      onChange={e => updateItem('expenses', i, 'label', e.target.value)}
                    />
                  </div>
                  <div className="relative w-32">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-xs">{symbol}</div>
                    <input 
                      type="number"
                      placeholder="Amount"
                      className={`${inputClass} pl-7`}
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={e => updateItem('expenses', i, 'amount', Number(e.target.value))}
                    />
                  </div>
                  <button 
                    onClick={() => removeItem('expenses', i)}
                    disabled={formData.expenses.length <= 1}
                    className="p-3 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addItem('expenses')}
                className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs text-secondary hover:border-[#C9A84C]/40 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add Expense
              </button>
            </div>
          </section>

          {/* Savings Section */}
          <section>
            <span className={sectionLabelClass}>Total Savings</span>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-xs">{symbol}</div>
              <input 
                type="number"
                placeholder="Total Cash/Savings"
                className={`${inputClass} pl-7`}
                value={formData.savings === 0 ? "" : formData.savings}
                onChange={e => setFormData({ ...formData, savings: Number(e.target.value) })}
              />
            </div>
          </section>

          {/* Debts Section */}
          <section>
            <span className={sectionLabelClass}>Debts</span>
            <div className="space-y-4">
              {formData.debts.map((item: { label: string; amount: number }, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      placeholder="Debt Label"
                      className={inputClass}
                      value={item.label}
                      onChange={e => updateItem('debts', i, 'label', e.target.value)}
                    />
                  </div>
                  <div className="relative w-32">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-xs">{symbol}</div>
                    <input 
                      type="number"
                      placeholder="Amount"
                      className={`${inputClass} pl-7`}
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={e => updateItem('debts', i, 'amount', Number(e.target.value))}
                    />
                  </div>
                  <button 
                    onClick={() => removeItem('debts', i)}
                    className="p-3 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addItem('debts')}
                className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs text-secondary hover:border-[#C9A84C]/40 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add Debt
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-white/5 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90 font-bold gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
