"use client"

import { useState, use } from 'react'
import { signInWithGoogle } from '../login/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, EyeOff, MailOpen, ArrowRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)
  
  // Logic states
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    setUserEmail(email)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: userEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setResendStatus('Error resending email')
    } else {
      setResendStatus('Email resent!')
      setTimeout(() => setResendStatus(null), 3500)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0D14] flex flex-col relative overflow-hidden selection:bg-primary selection:text-black font-josefin">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Logo */}
      <div className="absolute top-0 left-0 p-8 z-20">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          WorthAI
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-[420px] w-full">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#11141D]/50 border border-white/5 p-10 backdrop-blur-xl rounded-[32px] shadow-2xl relative group"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/20 to-transparent rounded-[32px] opacity-50 pointer-events-none" />
                
                <div className="relative">
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-3 text-white tracking-tight uppercase">Own Your Future</h1>
                    <p className="text-secondary/60 text-sm font-medium">Create your account to start the journey.</p>
                  </div>

                  {(error || resolvedSearchParams.error) && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center rounded-xl animate-shake">
                      {error || resolvedSearchParams.error}
                    </div>
                  )}

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Choose Password</label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 pr-12 text-white focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-primary transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" /> }
                        </button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        disabled={isLoading}
                        className="w-full h-14 bg-primary text-black font-bold uppercase tracking-[0.15em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                            Creating...
                          </div>
                        ) : "Create Account"}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-10 pt-10 border-t border-white/5 text-center">
                    <p className="text-[10px] text-secondary/40 mb-6 uppercase font-black tracking-[0.2em]">Or continue with</p>
                    <form>
                        <Button formAction={signInWithGoogle} variant="ghost" className="w-full h-14 border border-white/5 hover:border-white/20 text-white font-bold uppercase tracking-[0.1em] text-[11px] rounded-2xl bg-[#11141D] hover:bg-white/5 transition-all shadow-xl group">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Google
                        </Button>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="confirmation-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#11141D]/50 border border-primary/20 p-12 backdrop-blur-3xl rounded-[40px] shadow-2xl relative text-center overflow-hidden"
              >
                {/* Accent lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-primary/10 blur-[80px] -z-10" />
                
                <div className="mb-8">
                  <span className="text-xl font-bold tracking-tighter text-primary">WorthAI</span>
                </div>

                <div className="relative mb-8 inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
                    <MailOpen className="w-9 h-9" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Check your inbox</h2>
                <p className="text-secondary/60 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto">
                  We sent a confirmation link to <span className="text-white font-bold">{userEmail}</span>. Please click it to activate your account.
                </p>

                <div className="space-y-4">
                  <Button 
                    onClick={handleResend}
                    variant="outline" 
                    className="w-full h-14 border-white/10 hover:border-primary/40 text-secondary/60 hover:text-primary transition-all rounded-2xl bg-transparent font-bold tracking-widest text-[10px] uppercase"
                  >
                    {resendStatus ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        {resendStatus}
                      </div>
                    ) : "Resend Email"}
                  </Button>
                  
                  <p className="text-[10px] text-secondary/40 font-medium px-4">
                    Didn't receive it? Check your spam folder or wait a minute.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <p className="mt-8 text-center text-sm text-secondary/60">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                Sign in here
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
