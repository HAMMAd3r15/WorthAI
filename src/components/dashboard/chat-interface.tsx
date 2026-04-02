"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, CheckCircle2, AlertCircle, Info, X, Clock } from "lucide-react"
import { WorthLogo } from "@/components/ui/worth-logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { MobileSummaryBar } from "./mobile-summary-bar"
import { useData } from "@/components/providers/data-provider"

type Message = {
  role: 'user' | 'assistant'
  content: string
  verdict?: 'YES' | 'NO' | 'NOT YET' | 'ACHIEVABLE' | 'CHALLENGING' | 'URGENT' | 'ON TRACK' | 'GOOD MOVE' | 'RISKY'
  actionPlan?: string[] | null
  createdAt?: string
}

const EXAMPLES = [
  "Can I afford to buy a new car next month?",
  "Should I prioritize paying off my student loans or saving?",
  "I want to move to a new apartment, is it a good idea?"
]

const parseAnswer = (rawAnswer: string) => {
  const verdictMatch = rawAnswer.match(/VERDICT:\s*(YES|NO|NOT YET|ACHIEVABLE|CHALLENGING|URGENT|ON TRACK|GOOD MOVE|RISKY)/i)
  const verdict = (verdictMatch ? verdictMatch[1].toUpperCase() : "ON TRACK") 
  
  const explanationMatch = rawAnswer.match(/EXPLANATION:\s*([\s\S]*?)(?=ACTION PLAN:|$)/i)
  let reasoning = explanationMatch ? explanationMatch[1].trim() : ""

  if (!reasoning && !verdictMatch) {
    reasoning = rawAnswer;
  } else if (!reasoning) {
    reasoning = rawAnswer.replace(/VERDICT:\s*.*?\n/i, '').trim();
  }
  
  const actionPlanMatch = rawAnswer.match(/ACTION PLAN:\s*([\s\S]*)/i)
  const actionPlanRaw = actionPlanMatch ? actionPlanMatch[1].trim() : ""
  const actionPlan = actionPlanRaw
    .split(/\b\d+\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return { verdict, reasoning, actionPlan: actionPlan.length > 0 ? actionPlan : null }
}

const formatDateLabel = (date: string) => {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export function ChatInterface() {
  const supabase = createClient()
  const { profile, refreshData } = useData()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const usage = profile?.questions_today ?? 0
  const limit = 10
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
      const diff = nextMidnightUTC.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeLeft({ hours, minutes })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [])

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  useEffect(() => {
    const dismissed = localStorage.getItem('worthai-disclaimer-dismissed')
    if (dismissed === 'true') setShowDisclaimer(false)
  }, [])

  const dismissDisclaimer = () => {
    setShowDisclaimer(false)
    localStorage.setItem('worthai-disclaimer-dismissed', 'true')
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: history } = await supabase
          .from('chat_history')
          .select('question, answer, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(50)

        if (history && history.length > 0) {
          const formattedMessages: Message[] = []
          
          ;(history as any[]).forEach((row: { question: string, answer: string, created_at: string }) => {
            // Add user message
            formattedMessages.push({
              role: 'user',
              content: row.question,
              createdAt: row.created_at
            })

            // Parse and add assistant message
            const parsed = parseAnswer(row.answer)
            formattedMessages.push({
              role: 'assistant',
              content: parsed.reasoning,
              verdict: parsed.verdict as any,
              actionPlan: parsed.actionPlan,
              createdAt: row.created_at
            })
          })

          setMessages(formattedMessages)
          
          // Trigger welcome banner after a slight delay for better UX
          setTimeout(() => setShowWelcome(true), 500)
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [])

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, historyLoading])

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage = text.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage, createdAt: new Date().toISOString() }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      })

      const data = await response.json()

      if (data.redirect) {
        // Store message for onboarding page to show as toast
        sessionStorage.setItem('onboarding_toast', data.error || "Please complete your financial profile first")
        window.location.href = data.redirect
        return
      }

      if (data.error) {
        if (data.status === 429) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `You've reached your daily limit of ${data.limit || 10} questions. Your limit resets at midnight.`,
            createdAt: new Date().toISOString()
          }])
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.error,
            createdAt: new Date().toISOString()
          }])
        }
        refreshData() // Sync limit
        setLoading(false)
        return
      } else {
        refreshData() // Sync limit
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.reasoning,
          verdict: data.verdict as any,
          actionPlan: data.actionPlan,
          createdAt: new Date().toISOString()
        }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, something went wrong on our end.",
        verdict: 'NOT YET',
        createdAt: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <MobileSummaryBar />
      {/* Messages */}

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-6 pt-8 pb-40 space-y-8 scroll-smooth"
      >
        {showDisclaimer && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#111827] border border-white/5 rounded-2xl flex items-start gap-3 relative group transition-all hover:border-white/10"
          >
            <Info className="w-4 h-4 text-secondary/60 shrink-0 mt-0.5" />
            <p className="text-[13px] text-secondary leading-relaxed pr-8 font-medium">
              Worth provides AI-generated financial guidance for informational purposes only. This is not professional financial advice.
            </p>
            <button 
              onClick={dismissDisclaimer}
              className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5 text-secondary/40 group-hover:text-secondary/60" />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {showWelcome && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center mb-4 sticky top-0 z-10"
            >
              <div className="bg-[#111827]/80 backdrop-blur-md border border-[#C9A84C]/20 px-4 py-2 rounded-full shadow-2xl shadow-black">
                <p className="text-[11px] font-bold text-[#C9A84C] tracking-wide">
                  Welcome back — here&apos;s where you left off
                </p>
              </div>
            </motion.div>
          )}

          {historyLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 max-w-[70%] space-y-3">
                    <div className="h-4 bg-white/5 rounded-lg w-1/4 animate-pulse" />
                    <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-6 border border-[#C9A84C]/20 shadow-xl shadow-[#C9A84C]/5">
                <WorthLogo className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-white">Ask WorthAI anything.</h2>
              <p className="text-secondary text-sm mb-10 leading-relaxed font-medium">
                I'm your brutally honest financial guide. I'll use your actual numbers to give you a real verdict.
              </p>
              <div className="grid gap-3 w-full">
                {EXAMPLES.map((example, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(example)}
                    className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-secondary hover:border-[#C9A84C]/40 hover:text-white transition-all text-left font-medium"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((m, i) => {
              const prevMessage = messages[i - 1];
              const showDateLabel = !prevMessage || 
                (m.createdAt && prevMessage.createdAt && 
                 new Date(m.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString());

              return (
                <div key={i} className="space-y-8">
                  {showDateLabel && m.createdAt && (
                    <div className="flex justify-center my-12">
                      <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                        {formatDateLabel(m.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-[#C9A84C]/20">
                        <WorthLogo className="w-full h-full" />
                      </div>
                    )}

                    <div className={`max-w-[85%] md:max-w-[70%] ${
                      m.role === 'user' 
                      ? 'bg-[#111827] border-white/10 rounded-2xl rounded-tr-none p-4 md:p-5 text-white/90' 
                      : 'bg-white/5 border-white/5 rounded-2xl rounded-tl-none p-4 md:p-6 shadow-2xl'
                    } border`}>
                      {m.role === 'assistant' && (
                        <div className="mb-0">
                          {m.verdict && (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase mb-4 ${
                              ['YES', 'ON TRACK', 'GOOD MOVE'].includes(m.verdict) ? 'bg-success text-black' : 
                              ['NO', 'URGENT', 'RISKY'].includes(m.verdict) ? 'bg-danger text-white' : 
                              ['NOT YET', 'CHALLENGING'].includes(m.verdict) ? 'bg-warning text-black' :
                              'bg-blue-500 text-white'
                            }`}>
                              {m.verdict}
                            </span>
                          )}
                          <p className="text-[14px] leading-[1.5] md:text-[15px] md:leading-relaxed text-foreground font-medium mb-4 md:mb-6">
                            {m.content}
                          </p>
                          
                          {m.actionPlan && m.actionPlan.length > 0 && (
                            <div className="space-y-2 md:space-y-3 bg-white/5 p-3 md:p-5 rounded-xl border border-white/5">
                              <h4 className="text-[9px] md:text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-1">Action Plan</h4>
                              <ul className="space-y-1.5 md:space-y-2.5">
                                {m.actionPlan.map((step, si) => (
                                  <li key={si} className="flex gap-2 md:gap-3 text-[13px] md:text-sm text-secondary font-medium leading-normal">
                                    <span className="text-[#C9A84C] font-bold">{si + 1}.</span>
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {m.role === 'user' && (
                        <p className="text-sm font-medium">{m.content}</p>
                      )}
                    </div>

                    {m.role === 'user' && (
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })
          )}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <WorthLogo className="w-full h-full animate-pulse" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                {[0, 0.2, 0.4].map((delay) => (
                   <motion.div 
                    key={delay}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                    className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"
                   />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bar or Limit Reached Card */}
      <div className="border-t border-[#C9A84C]/10 bg-[#0A0D14] p-5 px-6 shrink-0 z-50">
        <div className="max-w-4xl mx-auto">
          {usage < limit ? (
            <>
              {/* Input Area */}
              <div className="relative group">
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(input)
                    }
                  }}
                  placeholder="E.g. Can I afford a Tesla Model 3 this year?"
                  rows={1}
                  className="w-full bg-[#111827] border border-white/10 p-4 pr-16 text-[15px] leading-relaxed text-foreground placeholder-[#4B5563] focus:border-[#C9A84C]/40 outline-none transition-all rounded-2xl shadow-2xl resize-none min-h-[52px] max-h-[120px] scrollbar-hide"
                />
                
                <motion.button 
                  whileHover={{ backgroundColor: "#D4B96A" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || loading}
                  className="absolute right-2.5 bottom-2.5 w-11 h-11 bg-[#C9A84C] text-[#0A0D14] rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#C9A84C]/10"
                >
                  <Send className="w-4.5 h-4.5" />
                </motion.button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#374151] text-center mt-2.5 font-medium tracking-tight">
                AI guidance only · Not a licensed financial advisor
              </p>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111827] border border-[#C9A84C]/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl shadow-black relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[#C9A84C]/[0.02] pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mb-6 relative z-10 border border-[#C9A84C]/10">
                <Clock className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                You&apos;ve used all {limit} questions for today
              </h3>
              <p className="text-secondary text-sm mb-6 max-w-sm relative z-10 opacity-60">
                Come back tomorrow — Worth resets at midnight
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 relative z-10 shadow-xl">
                <span className="text-secondary/60 text-[10px] font-bold uppercase tracking-widest">
                  Resets in {timeLeft.hours} hours {timeLeft.minutes} minutes
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
