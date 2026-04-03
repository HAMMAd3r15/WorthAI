import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { WorthLogo } from '@/components/ui/worth-logo'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-josefin text-foreground/90 selection:bg-primary/30 selection:text-white">
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/2 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Navigation */}
      <nav className="h-24 flex items-center relative z-10">
        <div className="max-w-[1100px] mx-auto px-6 w-full">
          <Link href="/" className="group flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
               <div className="w-5 h-5 flex items-center justify-center shrink-0 overflow-hidden">
                 <WorthLogo className="w-5 h-5" />
               </div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">WorthAI</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-[760px] mx-auto px-6 pt-12 pb-40 relative z-10">
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Info className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">About WorthAI</h1>
          <p className="text-secondary font-medium uppercase tracking-[0.2em] text-xs opacity-60">Who we are and what we do</p>
        </header>

        <div className="space-y-16">
          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">01.</span>
              Our Mission
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              WorthAI is an AI-powered personal finance advisor designed to make premium financial guidance accessible to everyone. We believe that understanding your money shouldn&apos;t require an expensive financial advisor or a degree in economics. Our mission is to <span className="text-white font-bold italic">democratize financial intelligence</span> by providing clear, context-aware, and actionable financial advice to individuals at every stage of their financial journey.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">02.</span>
              What We Do
            </h2>
            <div className="space-y-4 text-lg text-secondary/90 font-medium leading-relaxed">
              <p>WorthAI provides a suite of intelligent financial tools built around your unique financial profile:</p>
              <ul className="grid gap-4 bg-white/5 p-8 rounded-2xl border border-white/5">
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span><span className="text-white font-bold">AI Financial Advisor</span> — Ask any financial question and receive personalized, data-driven answers based on your actual income, expenses, debts, and savings.</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span><span className="text-white font-bold">Net Worth Tracking</span> — Monitor your financial health over time with automatic net worth calculations and historical tracking.</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span><span className="text-white font-bold">Monthly Health Audits</span> — Receive comprehensive monthly reports analyzing your spending patterns, savings rate, and debt management progress.</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span><span className="text-white font-bold">Financial Profile Management</span> — Maintain an up-to-date snapshot of your finances that powers all of our AI recommendations.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">03.</span>
              How It Works
            </h2>
            <div className="space-y-6 text-lg text-secondary/90 font-medium leading-[1.8]">
              <p>
                WorthAI works by combining your self-reported financial data with advanced AI reasoning. You provide your income, monthly expenses, outstanding debts, and savings — and our AI engine uses this context to deliver highly personalized financial guidance.
              </p>
              <p>
                Unlike generic financial calculators, WorthAI considers your <span className="text-white font-bold italic">complete financial picture</span> when answering questions. Whether you&apos;re deciding on a major purchase, evaluating a career move, or building a debt payoff strategy, every answer is tailored to your reality.
              </p>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">04.</span>
              Our Values
            </h2>
            <div className="grid gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                <h3 className="text-primary font-bold mb-2">Transparency</h3>
                <p className="text-sm text-secondary/90">We are upfront about how we use your data, how our AI works, and what our limitations are. WorthAI is a guidance tool, not a licensed financial advisor.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                <h3 className="text-primary font-bold mb-2">Privacy First</h3>
                <p className="text-sm text-secondary/90">Your financial data is yours. We never sell your information to third parties. We never connect to your bank accounts. You control what we know.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                <h3 className="text-primary font-bold mb-2">Accessibility</h3>
                <p className="text-sm text-secondary/90">Quality financial advice should not be gated behind expensive subscriptions or wealth minimums. We are committed to keeping WorthAI accessible to everyone.</p>
              </div>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">05.</span>
              Disclaimer
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium bg-primary/5 p-8 rounded-2xl border border-primary/20">
              WorthAI provides AI-generated financial guidance for informational and educational purposes only. It is <span className="text-white font-bold">not a substitute</span> for professional financial advice from a certified financial planner, accountant, or licensed advisor. Always consult a qualified professional before making significant financial decisions. WorthAI does not guarantee the accuracy or completeness of any information provided.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">06.</span>
              Contact Us
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              Have questions about WorthAI or want to learn more? Reach out to us at <a href="mailto:worthai.support@gmail.com" className="text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all font-bold">worthai.support@gmail.com</a>. We&apos;d love to hear from you.
            </p>
          </section>
        </div>

        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 translate-z-0">
           <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all group font-bold">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
           </Link>
           <span className="text-[10px] text-secondary/30 uppercase tracking-[0.4em] font-bold">WorthAI &nbsp; | &nbsp; 2026</span>
        </div>
      </main>
    </div>
  )
}
