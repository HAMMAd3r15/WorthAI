"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle2, FileText, Lock, RefreshCw } from "lucide-react"
import { WorthLogo } from "@/components/ui/worth-logo"
import { createClient } from "@/lib/supabase/client"

export function MonthlyReport({ 
  profile, 
  onUpgrade 
}: { 
  profile: any, 
  onUpgrade: () => void 
}) {
  const supabase = createClient()
  const [report, setReport] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function fetchExistingReport() {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('monthly_reports')
          .select('content')
          .eq('user_id', user.id)
          .eq('report_month', currentMonth)
          .single()

        if (data) setReport(data.content)
      }
    }
    fetchExistingReport()
  }, [supabase])

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
      setReport(data.report)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Monthly Report View (Unlocked for all)
  return (
    <Card className="bg-[#111827] border-[#C9A84C]/20 p-8 rounded-[32px] min-h-[400px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <span className="text-[10px] font-black uppercase text-[#C9A84C] tracking-[0.3em] mb-2 block">Monthly Audit</span>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            Your Health Report
            <div className="w-6 h-6 flex items-center justify-center shrink-0 overflow-hidden">
              <WorthLogo className="w-6 h-6" />
            </div>
          </h2>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {report ? (
             <Button 
               variant="outline" 
               onClick={() => generateReport(true)}
               disabled={loading}
               className="h-12 px-6 border-white/10 text-secondary hover:bg-white/5 font-bold rounded-xl flex-1 md:flex-none uppercase tracking-widest text-[10px]"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
               Regenerate
             </Button>
          ) : (
             <Button 
               onClick={() => generateReport()}
               disabled={loading}
               className="h-14 px-10 bg-[#C9A84C] text-black font-extrabold rounded-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest flex-1 md:flex-none shadow-xl shadow-[#C9A84C]/20"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Report"}
             </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && !report ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-10">
              <Loader2 className="w-16 h-16 text-[#C9A84C] animate-spin" />
              <div className="absolute inset-0 bg-[#C9A84C]/20 blur-2xl rounded-full" />
            </div>
            <p className="text-xl font-bold text-white mb-2">Analyzing your strategy...</p>
            <p className="text-secondary text-sm">WorthAI is evaluating your monthly trajectory based on your data.</p>
          </motion.div>
        ) : report ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Content */}
               <div className="lg:col-span-8 prose prose-invert prose-headings:text-[#C9A84C] prose-p:text-secondary max-w-none">
                  {report.split('\n\n').map((para, i) => {
                     if (para.includes('FINANCIAL HEALTH SCORE:')) {
                        const score = para.match(/\d+/)?.[0] || "0";
                        const text = para.replace('FINANCIAL HEALTH SCORE:', '').replace(score, '').replace('/', '').trim();
                        return (
                          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 mb-12 flex flex-col md:flex-row items-center gap-10">
                             <div className="relative shrink-0">
                                <span className="text-8xl font-black text-[#C9A84C] relative z-10">{score}</span>
                                <div className="absolute -inset-4 bg-[#C9A84C]/20 blur-3xl opacity-40" />
                                <span className="text-secondary/30 text-2xl font-black block mt-[-20px] ml-4 italic">/ 100</span>
                             </div>
                             <div className="text-center md:text-left">
                                <h4 className="text-[10px] font-black uppercase text-[#C9A84C] tracking-[0.4em] mb-4">Health Score</h4>
                                <p className="text-xl text-white font-medium leading-relaxed italic opacity-90">"{text}"</p>
                             </div>
                          </div>
                        )
                     }
                     
                     const sectionColors: {[key: string]: string} = {
                        "THIS MONTH'S WINS": "text-green-500",
                        "AREAS OF CONCERN": "text-rose-500",
                        "ACTION PLAN FOR NEXT MONTH": "text-[#C9A84C]",
                        "WORTHAI'S VERDICT": "text-white"
                     }

                     const line1 = para.split('\n')[0];
                     if (sectionColors[line1.replace(/\d\.\s*/, '').trim().toUpperCase()] || sectionColors[line1.toUpperCase()]) {
                        return (
                          <div key={i} className="mb-10">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A84C] mb-6 border-b border-[#C9A84C]/20 pb-2 w-fit">
                                {line1}
                             </h4>
                             <div className="text-secondary text-[15px] leading-relaxed space-y-4">
                                {para.split('\n').slice(1).map((line, idx) => (
                                  <p key={idx} className="flex gap-4">
                                     {line.startsWith('-') || line.match(/^\d\./) ? (
                                        <span className="text-[#C9A84C] shrink-0 font-black">•</span>
                                     ) : null}
                                     {line.replace(/^-\s*/, '').replace(/^\d\.\s*/, '')}
                                  </p>
                                ))}
                             </div>
                          </div>
                        )
                     }

                     return <p key={i} className="text-secondary leading-relaxed">{para}</p>
                  })}
               </div>

               {/* Summary Stats Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                     <h5 className="text-[10px] font-black uppercase text-[#C9A84C] tracking-widest mb-6">Pro Strategy Tip</h5>
                     <p className="text-sm text-secondary leading-relaxed italic opacity-80 mb-6">
                        "Financial wealth isn't built in days, but in the consistency of your monthly decisions. Trust the numbers."
                     </p>
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">WorthAI Verified</span>
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
               <FileText className="w-10 h-10 text-secondary/30" />
            </div>
            <p className="text-2xl font-bold text-white mb-2">Ready to generate your report?</p>
            <p className="text-secondary text-sm max-w-xs mx-auto">Click the button above and let WorthAI analyze your current trajectory.</p>
          </div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 animate-in fade-in slide-in-from-top-2 duration-300">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </Card>
  )
}
