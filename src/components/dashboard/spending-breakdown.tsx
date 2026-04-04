"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { Settings } from "lucide-react"

interface SpendingBreakdownProps {
  expenses: any[]
  onOpenSettings?: () => void
}

const COLORS = [
  "#C9A84C", // gold
  "#10B981", // green
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#14B8A6", // teal
]

export function SpendingBreakdown({ expenses, onOpenSettings }: SpendingBreakdownProps) {
  const total = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0)
  
  const data = expenses.map(exp => ({
    name: exp.label,
    value: exp.amount,
  })).filter(d => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Settings className="w-5 h-5 text-secondary/40" />
        </div>
        <p className="text-[11px] font-medium text-secondary/60 leading-relaxed max-w-[140px] mx-auto">
          Add your expenses in Settings to see your spending breakdown
        </p>
        {onOpenSettings && (
          <button 
            onClick={onOpenSettings}
            className="mt-4 text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest hover:underline"
          >
            Open Settings
          </button>
        )}
      </div>
    )
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-[24px] p-6 shadow-xl shadow-black/20">
      <h4 className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-6">Spending Breakdown</h4>
      
      <div className="h-[180px] w-full relative mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid rgba(201,168,76,0.3)', 
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#F9FAFB', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any, name: any) => [
                <span key="val" className="flex items-center gap-2">
                  {formatCurrency(Number(value))}
                  <span className="text-[10px] text-secondary font-medium">({total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)</span>
                </span>,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Total</p>
          <p className="text-lg font-black text-white tracking-tight">{formatCurrency(total)}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {data.slice(0, 6).map((item, i) => (
          <div key={item.name} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: COLORS[i % COLORS.length] }} 
              />
              <span className="text-[12px] font-medium text-secondary group-hover:text-white transition-colors truncate max-w-[100px]">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-white leading-none mb-1">{formatCurrency(item.value)}</p>
              <p className="text-[9px] font-bold text-secondary/40">{((item.value / total) * 100).toFixed(0)}%</p>
            </div>
          </div>
        ))}
        {data.length > 6 && (
          <p className="text-[10px] text-center text-secondary/30 font-medium pt-2 italic">
            + {data.length - 6} more categories
          </p>
        )}
      </div>
    </div>
  )
}
