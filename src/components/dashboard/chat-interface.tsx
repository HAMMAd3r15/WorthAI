"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, User, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { MobileSummaryBar } from "./mobile-summary-bar"

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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

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

      if (data.error) {
        if (response.status === 429) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "You've reached your daily limit of 5 questions. Upgrade to **Worth Pro** for unlimited advice and premium features.",
            createdAt: new Date().toISOString()
          }])
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.error,
            createdAt: new Date().toISOString()
          }])
        }
        setLoading(false)
        return
      } else {
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
        className="flex-1 overflow-y-auto px-6 pt-8 pb-32 space-y-8 scroll-smooth"
      >
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
              <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mb-6 border border-[#C9A84C]/20">
                <Sparkles className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-white">Ask Worth anything.</h2>
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
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 shadow-lg shadow-[#C9A84C]/20">
                        <Sparkles className="w-5 h-5 text-black" />
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
              <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-black animate-pulse" />
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

      {/* Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/90 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="E.g. Can I afford a Tesla Model 3 this year?"
            className="w-full bg-[#111827] border border-white/10 p-6 pr-16 text-sm text-foreground focus:border-[#C9A84C]/50 outline-none transition-all rounded-2xl shadow-2xl shadow-black/50"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#C9A84C] text-black rounded-xl flex items-center justify-center hover:bg-[#C9A84C]/90 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
