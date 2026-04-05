"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, CheckCircle2, AlertCircle, Info, X, Clock, ChevronDown } from "lucide-react"
import { WorthLogo } from "@/components/ui/worth-logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useData } from "@/components/providers/data-provider"
import { useCurrency } from "@/context/CurrencyContext"

type Message = {
  role: 'user' | 'assistant'
  content: string
  verdict?: 'YES' | 'NO' | 'NOT YET' | 'ACHIEVABLE' | 'CHALLENGING' | 'URGENT' | 'ON TRACK' | 'GOOD MOVE' | 'RISKY' | 'NICE TRY' | 'LIVE PRICE' | 'ILLOGICAL' | 'OFF TRACK' | 'UNAVAILABLE'
  actionPlan?: string[] | null
  createdAt?: string
}

const EXAMPLES = [
  "Can I afford to buy a new car next month?",
  "Should I prioritize paying off my student loans or saving?",
  "I want to move to a new apartment, is it a good idea?"
]

const parseAnswer = (rawAnswer: string) => {
  const verdictMatch = rawAnswer.match(/VERDICT:\s*(YES|NO|NOT YET|ACHIEVABLE|CHALLENGING|URGENT|ON TRACK|GOOD MOVE|RISKY|NICE TRY|LIVE PRICE|ILLOGICAL|OFF TRACK|UNAVAILABLE)/i)
  const verdict = (verdictMatch ? verdictMatch[1].toUpperCase() : "ON TRACK") 
  
  const explanationMatch = rawAnswer.match(/EXPLANATION:\s*([\s\S]*?)(?=ACTION PLAN:|$)/i)
  let reasoning = explanationMatch ? explanationMatch[1].trim() : ""

  if (!reasoning && !verdictMatch) {
    reasoning = rawAnswer.replace(/ACTION PLAN:\s*[\s\S]*/i, '').trim();
  } else if (!reasoning) {
    reasoning = rawAnswer.replace(/VERDICT:\s*.*?\n/i, '').replace(/ACTION PLAN:\s*[\s\S]*/i, '').trim();
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
  const { symbol } = useCurrency()
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

  // Typing animation for placeholder
  const placeholders = [
    `E.g. Can I afford a Tesla Model 3 this year?`,
    `E.g. How should I invest ${symbol}10k for retirement?`,
    "E.g. What's the best way to save for a house?",
    "E.g. Should I pay off debt or invest extra cash?",
    "E.g. How much should my emergency fund be?"
  ]
  const [placeholder, setPlaceholder] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)

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

  // Typewriter effect
  useEffect(() => {
    if (input.length > 0) {
      setPlaceholder("")
      return
    }

    const currentString = placeholders[placeholderIndex]
    const timeout = setTimeout(() => {
      if (isTyping) {
        if (charIndex < currentString.length) {
          setPlaceholder(prev => prev + currentString[charIndex])
          setCharIndex(prev => prev + 1)
        } else {
          setTimeout(() => setIsTyping(false), 1200)
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(prev => prev.slice(0, -1))
          setCharIndex(prev => prev - 1)
        } else {
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length)
          setIsTyping(true)
        }
      }
    }, isTyping ? 35 : 25)

    return () => clearTimeout(timeout)
  }, [charIndex, isTyping, placeholderIndex, input, placeholders])

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
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      
      // Auto-scroll only if already near bottom or it's the very first message
      if (distanceFromBottom < 150 || messages.length <= 2) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        setShowScrollButton(false)
        setHasUnreadMessages(false)
      } else {
        // If new message arrives and user is scrolled up, show the badge
        setHasUnreadMessages(true)
        setShowScrollButton(true)
      }
    }
  }, [messages, historyLoading])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const isNearBottom = distanceFromBottom < 100
    
    setShowScrollButton(!isNearBottom)
    
    // Reset unread flag if reached bottom
    if (isNearBottom) {
      setHasUnreadMessages(false)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

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
      {/* Messages */}

      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
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
                      ? 'bg-[#111827] border-white/10 rounded-2xl rounded-tr-none p-[10px_14px] md:p-5 text-white/90' 
                      : 'bg-white/5 border-white/5 rounded-2xl rounded-tl-none p-[12px_16px] md:p-6 shadow-2xl'
                    } border`}>
                      {m.role === 'assistant' && (
                        <div className="mb-0">
                          {m.verdict && (
                            <span className={`inline-flex items-center p-[3px_10px] rounded text-[11px] md:text-[10px] md:px-2.5 md:py-1 font-bold tracking-widest uppercase mb-4 ${
                              ['YES', 'ON TRACK', 'GOOD MOVE'].includes(m.verdict) ? 'bg-success text-black' : 
                              ['NO', 'URGENT', 'RISKY'].includes(m.verdict) ? 'bg-danger text-white' : 
                              ['NOT YET', 'CHALLENGING'].includes(m.verdict) ? 'bg-warning text-black' :
                              m.verdict === 'NICE TRY' ? 'bg-purple-500 text-white' :
                              m.verdict === 'LIVE PRICE' ? 'bg-blue-500 text-white' :
                              m.verdict === 'ILLOGICAL' ? 'bg-orange-500 text-black' :
                              m.verdict === 'OFF TRACK' ? 'bg-warning text-black' :
                              m.verdict === 'UNAVAILABLE' ? 'bg-gray-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {m.verdict}
                            </span>
                          )}
                          <p className="text-[13px] leading-[1.5] md:text-[15px] md:leading-relaxed text-foreground font-medium mb-4 md:mb-6 whitespace-pre-wrap">
                            {m.content}
                          </p>

                          {m.verdict === 'LIVE PRICE' && (
                            <p className="text-[11px] text-secondary/50 italic -mt-2 mb-4 md:mb-6">
                              Prices may be delayed up to 15 minutes during market hours.
                            </p>
                          )}
                          
                          {m.actionPlan && m.actionPlan.length > 0 && (
                            <div className="space-y-2 md:space-y-3 bg-white/5 p-[10px_12px] md:p-5 rounded-xl border border-white/5">
                              <h4 className="text-[9px] md:text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-1">Action Plan</h4>
                              <ul className="space-y-1.5 md:space-y-2.5">
                                {m.actionPlan.map((step, si) => (
                                  <li key={si} className="flex gap-2 md:gap-3 text-[12px] leading-[1.4] md:text-sm md:leading-normal text-secondary font-medium">
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
                        <p className="text-[13px] md:text-sm font-medium">{m.content}</p>
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

      {/* Scroll to Bottom Button - Fixed Position Layer */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            key="scroll-to-bottom-button"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-40 right-6 z-[999]"
          >
            <button
              onClick={scrollToBottom}
              className="w-[44px] h-[44px] bg-[#111827] border-[1px] border-[#C9A84C]/30 rounded-full flex items-center justify-center text-[#C9A84C] shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:bg-[#1a2333] hover:border-[#C9A84C]/80 hover:scale-[1.05] active:scale-[0.98] transition-all group relative"
              title="Scroll to bottom"
            >
              <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              
              {/* Unread Message Indicator Dot */}
              {hasUnreadMessages && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#C9A84C] rounded-full border-2 border-[#111827] shadow-lg animate-bounce" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar or Limit Reached Card */}
      <div className="border-t border-[#C9A84C]/10 bg-[#0A0D14] p-5 px-6 shrink-0 z-50">
        <div className="max-w-4xl mx-auto">
          {usage < limit ? (
            <>
              {/* Input Area */}
              <div className="relative group bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[24px] shadow-2xl transition-all focus-within:border-[#C9A84C]/40 focus-within:shadow-[0_0_20px_rgba(201,168,76,0.1)] overflow-hidden flex items-center">
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
                  placeholder={placeholder}
                  rows={1}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="w-full bg-transparent border-none p-4 pr-16 text-[15px] leading-relaxed text-foreground placeholder-[#4B5563]/60 outline-none resize-none min-h-[56px] max-h-[120px] scrollbar-hide relative z-10"
                />
                
                <motion.button 
                  whileHover={{ 
                    backgroundColor: "#D4B96A",
                    boxShadow: "0 0 15px rgba(201, 168, 76, 0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 w-10 h-10 bg-[#C9A84C] text-[#0A0D14] rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#C9A84C]/10 z-20 group-hover:shadow-[#C9A84C]/20 overflow-hidden"
                >
                  <Send className="w-4 h-4 relative z-10" />
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-20 pointer-events-none"
                  />
                </motion.button>
              </div>

              {/* Usage & Disclaimer */}
              <div className="flex flex-col items-center gap-1.5 mt-2.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(usage / limit) * 100}%` }}
                      className="h-full bg-[#C9A84C] transition-all duration-500" 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest leading-none">
                     {usage} / {limit} Used
                  </span>
                </div>
                <p className="text-[11px] text-[#374151] text-center font-medium tracking-tight">
                  AI guidance only · Not a licensed financial advisor
                </p>
              </div>
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
                You&apos;ve used all 10 AI questions per day
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
