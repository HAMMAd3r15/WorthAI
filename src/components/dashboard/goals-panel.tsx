"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Target, Trash2, Edit2, CheckCircle2, AlertCircle, Calendar, Home, Car, Plane, Briefcase, GraduationCap, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AddGoalModal } from "./add-goal-modal"
import { useCurrency } from "@/context/CurrencyContext"
import { formatAmount } from "@/lib/utils"

const CATEGORY_ICONS: Record<string, any> = {
  savings: Target,
  house: Home,
  car: Car,
  travel: Plane,
  business: Briefcase,
  education: GraduationCap,
  other: Heart,
}

export function GoalsPanel({ userId }: { userId: string }) {
  const supabase = createClient()
  const { symbol } = useCurrency()
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setGoals(data || [])
    } catch (err) {
      console.error("Failed to fetch goals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return
    
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      console.error("Failed to delete goal:", err)
    }
  }

  const formatCurrencyValue = (val: number) => formatAmount(val, symbol)

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">My Financial Goals</h1>
            <p className="text-secondary text-sm font-medium">Track your progress towards what matters most.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingGoal(null)
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 bg-[#C9A84C] text-black px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#C9A84C]/10"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </motion.button>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[220px] bg-white/5 rounded-[32px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-[#111827] border border-white/5 rounded-[40px] p-20 flex flex-col items-center text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-[#C9A84C]/5 border border-[#C9A84C]/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-[#C9A84C]/40" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">No goals set yet</h2>
              <p className="text-secondary text-sm max-w-[300px] font-medium leading-relaxed">
                Saving for a home? A car? Or just a rainy day? Define your targets and start tracking progress.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount)
              const Icon = CATEGORY_ICONS[goal.category] || Target
              const isCompleted = progress >= 100

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111827] border border-white/5 rounded-[32px] p-8 space-y-6 relative group overflow-hidden shadow-2xl shadow-black/40 hover:border-[#C9A84C]/30 transition-all duration-500"
                >
                  {/* Category Accent */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-32 h-32 text-[#C9A84C]" />
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        isCompleted 
                          ? 'bg-success/10 border-success/20 text-success' 
                          : 'bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C]'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white tracking-tight mb-1">{goal.title}</h3>
                        <div className="flex items-center gap-2 text-secondary/40 text-[10px] font-bold uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }) : 'No Deadline'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingGoal(goal)
                          setShowAddModal(true)
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-secondary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(goal.id)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5">Saved Amount</p>
                        <p className="text-2xl font-black text-white tracking-tighter">
                          {formatCurrencyValue(goal.current_amount)}
                          <span className="text-lg text-secondary/40 font-bold ml-1.5">/ {formatCurrencyValue(goal.target_amount)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1.5">Progress</p>
                        <p className={`text-xl font-black tracking-tighter ${isCompleted ? 'text-success' : 'text-[#C9A84C]'}`}>
                          {progress}%
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        className={`h-full rounded-full shadow-lg relative overflow-hidden ${
                          isCompleted ? 'bg-success' : 'bg-[#C9A84C]'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-20 animate-pulse" />
                      </motion.div>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2 text-success font-bold text-[11px] uppercase tracking-widest bg-success/5 p-2 px-3 rounded-lg border border-success/10 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Goal Achieved
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddGoalModal 
            userId={userId}
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchGoals}
            initialData={editingGoal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
