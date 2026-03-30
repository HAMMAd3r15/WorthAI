"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, RefreshCw, Loader2, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModals } from "@/components/providers/modal-provider"

interface Report {
  score: number;
  score_explanation: string;
  wins: { tag: string; text: string }[];
  concerns: { tag: string; text: string }[];
  action_plan: string[];
  verdict: string;
}

interface ReportModalProps {
  profile: any
  onClose: () => void
}

export function ReportModal({ profile, onClose }: ReportModalProps) {
  const { openPricing } = useModals()
  const [report, setReport] = useState<Report | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLocked = profile?.plan !== 'pro'
  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Fetch report on mount
  useEffect(() => {
    async function fetchReport() {
      setLoading(true)
      try {
        if (isLocked) {
          setLoading(false)
          return
        }
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regenerate: false })
        })
        const data = await response.json()
        if (data.report) {
          try {
            setReport(JSON.parse(data.report))
            setLastGenerated(new Date().toLocaleDateString())
          } catch (e) {
            setError("Your previous report is in an old format. Please click 'Regenerate' to see your new premium report.")
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  const generateReport = async (regenerate = false) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setReport(JSON.parse(data.report))
      setLastGenerated(new Date().toLocaleDateString())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 40) return "#EF4444" // Red
    if (score <= 70) return "#F59E0B" // Amber
    return "#10B981" // Green
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-[95vw] h-[90vh] md:w-full md:max-w-[600px] md:h-auto md:max-h-[85vh] bg-[#0A0D14] border border-white/10 rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 md:p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0A0D14] z-20">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">Worth Report</h2>
            <p className="text-secondary/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1">{currentMonthYear}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div 
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-[#0A0D14]/40 backdrop-blur-xl"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20 shadow-2xl mb-6 relative">
                  <Lock className="w-8 h-8 text-[#C9A84C]" />
                  <div className="absolute inset-0 bg-[#C9A84C]/20 blur-2xl rounded-full" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Pro Feature</h3>
                <p className="text-secondary text-base leading-relaxed mb-8 max-w-[280px]">
                  Unlock your monthly AI financial health audit and personalized action plans with <span className="text-[#C9A84C] font-bold">Worth Pro</span>.
                </p>
                <Button 
                  onClick={openPricing}
                  className="bg-[#C9A84C] text-black hover:bg-[#B69742] font-black px-8 py-6 rounded-2xl text-base shadow-xl shadow-[#C9A84C]/20 transition-all hover:scale-105 active:scale-95"
                >
                  Upgrade to Pro
                </Button>
                
                {/* Blurred fake content background */}
                <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none select-none">
                  <div className="p-8 space-y-12 blur-md">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full border-8 border-white/20" />
                        <div className="h-4 w-48 bg-white/20 rounded" />
                     </div>
                     <div className="space-y-4">
                        <div className="h-4 w-32 bg-[#10B981]/20 rounded" />
                        <div className="h-24 w-full bg-white/5 rounded-3xl" />
                     </div>
                     <div className="space-y-4">
                        <div className="h-4 w-32 bg-[#EF4444]/20 rounded" />
                        <div className="h-24 w-full bg-white/5 rounded-3xl" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ) : loading && !report ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20 shadow-lg shadow-[#C9A84C]/5">
                    <Sparkles className="w-8 h-8 text-[#C9A84C]" />
                  </div>
                  <div className="absolute inset-0 bg-[#C9A84C]/20 blur-2xl rounded-full animate-pulse" />
                </div>
                <p className="text-lg font-bold text-white mb-2 tracking-tight">Advisor is assembling your report...</p>
                <p className="text-secondary text-sm opacity-60">Crunching your financial data for the current month.</p>
              </motion.div>
            ) : report ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-4"
              >
                {/* 1. HEALTH SCORE CIRCLE */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    {/* SVG Circle */}
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="74"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="74"
                        stroke={getScoreColor(report.score)}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={465}
                        strokeDashoffset={465 - (465 * report.score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white leading-none">{report.score}</span>
                      <span className="text-secondary/40 text-xs font-bold mt-1 uppercase tracking-widest">/ 100</span>
                    </div>
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-4 blur-3xl opacity-20 rounded-full"
                      style={{ backgroundColor: getScoreColor(report.score) }}
                    />
                  </div>
                  <h3 className="text-secondary/60 text-sm font-medium italic px-4 max-w-sm leading-relaxed">
                    "{report.score_explanation}"
                  </h3>
                </div>

                {/* 2. WINS SECTION */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#10B981] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    THIS MONTH'S WINS
                  </h4>
                  <div className="grid gap-4">
                    {report.wins.map((win: { tag: string; text: string }, i: number) => (
                      <div key={i} className="group relative bg-[#111827]/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-3 shadow-2xl transition-all hover:bg-[#111827]">
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#10B981] rounded-l-3xl" />
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-black text-xs border border-[#10B981]/20">
                            {i + 1}
                          </div>
                          <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#10B981]/20">
                            {win.tag}
                          </span>
                        </div>
                        <p className="text-white/90 text-[15px] font-medium leading-relaxed pl-12">
                          {win.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CONCERNS SECTION */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#EF4444] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    AREAS OF CONCERN
                  </h4>
                  <div className="grid gap-4">
                    {report.concerns.map((concern: { tag: string; text: string }, i: number) => (
                      <div key={i} className="group relative bg-[#111827]/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-3 shadow-2xl transition-all hover:bg-[#111827]">
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#EF4444] rounded-l-3xl" />
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] font-black text-xs border border-[#EF4444]/20">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                          <span className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#EF4444]/20">
                            {concern.tag}
                          </span>
                        </div>
                        <p className="text-white/90 text-[14px] md:text-[15px] font-medium leading-relaxed pl-12">
                          {concern.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. ACTION PLAN */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A84C] flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    ACTION PLAN FOR NEXT MONTH
                  </h4>
                  <div className="grid gap-3">
                    {report.action_plan.map((action: string, i: number) => (
                      <div key={i} className="flex gap-4 p-5 bg-[#0D1117] border border-white/5 rounded-2xl group hover:border-[#C9A84C]/30 transition-all shadow-xl">
                        <span className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-black shrink-0 text-sm">
                          {i + 1}
                        </span>
                        <p className="text-white text-[14px] md:text-[15px] font-medium leading-relaxed opacity-90">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. VERDICT */}
                <div className="bg-[#0D1117] border border-[#C9A84C]/20 rounded-[32px] p-8 space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldAlert className="w-32 h-32 text-[#C9A84C]" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">WORTH'S VERDICT</h4>
                  <p className="text-white text-lg font-bold italic leading-relaxed opacity-100 relative z-10">
                    "{report.verdict}"
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {error && (
            <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-[24px] flex items-center gap-4 text-rose-500 shadow-xl shadow-rose-500/5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold tracking-tight">{error}</p>
              {error.includes('old format') && (
                <Button 
                  size="sm" 
                  onClick={() => generateReport(true)}
                  className="ml-auto bg-rose-500 text-white hover:bg-rose-600 font-black rounded-lg text-xs tracking-tighter"
                >
                  Regenerate Now
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-6 md:p-8 border-t border-white/5 flex flex-col md:flex-row items-center gap-4 shrink-0 bg-[#0A0D14] z-20">
          {!isLocked && report && (
            <Button 
              variant="outline" 
              onClick={() => generateReport(true)}
              disabled={loading}
              className="w-full md:w-auto h-12 md:h-10 px-6 border-white/10 text-secondary hover:bg-white/5 font-black rounded-2xl md:rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Regenerate Report
            </Button>
          )}
          <Button 
            onClick={onClose}
            className="w-full md:w-auto h-12 md:h-10 px-8 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl md:rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center"
          >
            Close Report
          </Button>
          <div className="hidden md:flex flex-1 justify-end">
            <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] opacity-20 italic whitespace-nowrap">Worth Financial Intelligence</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


