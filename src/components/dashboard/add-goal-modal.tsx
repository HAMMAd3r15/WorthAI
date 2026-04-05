"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Target, Heart, Home, Car, Plane, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useCurrency } from "@/context/CurrencyContext"

interface AddGoalModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: any
}

const CATEGORIES = [
  { id: 'savings', label: 'Savings', icon: Target },
  { id: 'house', label: 'Home', icon: Home },
  { id: 'car', label: 'Vehicle', icon: Car },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'other', label: 'Other', icon: Heart },
]

export function AddGoalModal({ userId, isOpen, onClose, onSuccess, initialData }: AddGoalModalProps) {
  const supabase = createClient()
  const { symbol } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    target_amount: initialData?.target_amount || "",
    current_amount: initialData?.current_amount || "",
    deadline: initialData?.deadline || "",
    category: initialData?.category || "savings",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('financial_goals')
          .update({
            ...formData,
            target_amount: parseFloat(formData.target_amount.toString()),
            current_amount: parseFloat(formData.current_amount.toString()),
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('financial_goals')
          .insert({
            ...formData,
            user_id: userId,
            target_amount: parseFloat(formData.target_amount.toString()),
            current_amount: parseFloat(formData.current_amount.toString()),
          })
        
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Failed to save goal:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        className="relative w-full max-w-[500px] bg-[#0A0D14] border border-[#C9A84C]/20 rounded-[32px] overflow-hidden shadow-2xl shadow-black"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {initialData ? "Edit Goal" : "New Financial Goal"}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-secondary/40" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5 block ml-1">Goal Name</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. New Tesla Model 3"
                  className="w-full bg-[#111827] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder-secondary/20 focus:border-[#C9A84C]/40 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5 block ml-1">Target ({symbol})</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-sm">{symbol}</div>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.target_amount}
                      onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                      placeholder="50,000"
                      className="w-full bg-[#111827] border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm text-white placeholder-secondary/20 focus:border-[#C9A84C]/40 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5 block ml-1">Saved ({symbol})</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 font-bold text-sm">{symbol}</div>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.current_amount}
                      onChange={e => setFormData({ ...formData, current_amount: e.target.value })}
                      placeholder="10,000"
                      className="w-full bg-[#111827] border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm text-white placeholder-secondary/20 focus:border-[#C9A84C]/40 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5 block ml-1">Target Date</label>
                <input 
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-[#111827] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-[#C9A84C]/40 outline-none transition-all [color-scheme:dark]"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      formData.category === cat.id 
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30 text-white' 
                        : 'bg-[#111827] border-white/5 text-secondary/40 hover:border-white/10'
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#C9A84C] text-black h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D4B96A] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {initialData ? "Update Goal" : "Create Goal"}
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
