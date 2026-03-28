"use client"

import { useState, use } from 'react'
import { login, signInWithGoogle } from './actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <main className="min-h-screen bg-[#0A0D14] flex flex-col relative overflow-hidden selection:bg-primary selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Logo */}
      <div className="absolute top-0 left-0 p-8 z-20">
        <Link href="/" className="text-2xl font-josefin font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          WORTH
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-[400px] w-full">
          {/* Auth Card */}
          <div className="bg-[#11141D]/50 border border-white/5 p-10 backdrop-blur-xl rounded-[32px] shadow-2xl relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/20 to-transparent rounded-[32px] opacity-50 pointer-events-none" />
            
            <div className="relative">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-josefin font-bold mb-3 text-white tracking-tight uppercase">Welcome Back</h1>
                <p className="text-secondary/60 text-sm font-josefin font-medium">Continue your journey to financial wisdom.</p>
              </div>

              {resolvedSearchParams.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center rounded-xl">
                  {resolvedSearchParams.error}
                </div>
              )}

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-josefin focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end mr-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Password</label>
                    <a href="#" className="text-[9px] font-bold uppercase tracking-widest text-secondary/40 hover:text-primary transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 pr-12 text-white font-josefin focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
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
                  <Button formAction={login} className="w-full h-14 bg-primary text-black font-bold uppercase tracking-[0.15em] text-xs hover:scale-[1.02] transition-transform rounded-2xl shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                    Sign In
                  </Button>
                </div>
              </form>

              <div className="mt-10 pt-10 border-t border-white/5 text-center">
                <p className="text-[10px] text-secondary/40 mb-6 uppercase font-black tracking-[0.2em]">Or continue with</p>
                <form>
                    <Button formAction={signInWithGoogle} variant="ghost" className="w-full h-14 border border-white/5 hover:border-white/20 text-white font-josefin font-bold uppercase tracking-[0.1em] text-[11px] rounded-2xl bg-[#11141D] hover:bg-white/5 transition-all shadow-xl group">
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
          </div>

          <p className="mt-8 text-center text-sm font-josefin text-secondary/60">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
