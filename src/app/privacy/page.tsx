import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { WorthLogo } from '@/components/ui/worth-logo'

export default function PrivacyPage() {
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
            <Shield className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Confidential</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">Privacy Policy</h1>
          <p className="text-secondary font-medium uppercase tracking-[0.2em] text-xs opacity-60">Last updated: March 28, 2026</p>
        </header>

        <div className="space-y-16">
          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">01.</span>
              Information We Collect
            </h2>
            <div className="space-y-4 text-lg text-secondary/90 font-medium leading-relaxed">
              <p>We collect information you provide directly to ensure WorthAI can give you the best possible financial advice:</p>
              <ul className="grid gap-4 bg-white/5 p-8 rounded-2xl border border-white/5">
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Email address for account identification and authentication</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Financial profile data: income, expenses, savings, and debts</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Usage data: questions asked and full chat history</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">02.</span>
              How We Use Your Information
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              We use your information solely to provide personalized AI financial advice. <span className="text-white font-bold italic">We do not sell your data to third parties.</span> We do not share your financial information with anyone outside of WorthAI without your explicit consent.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">03.</span>
              Data Storage
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium font-josefin">
              Your data is stored securely using Supabase, which uses industry-standard encryption. Financial profile data is stored in our database and is only accessible to you through our authenticated API.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">04.</span>
              Data Retention
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              We retain your data for as long as your account is active. You can delete your account and all associated data at any time from the Settings panel inside the dashboard. Once deleted, your financial information cannot be recovered.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">05.</span>
              Cookies
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              WorthAI uses session and authentication cookies to provide the service. See our Cookie Policy for more details.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">06.</span>
              Third Party Services
            </h2>
            <div className="space-y-4 text-lg text-secondary/90 font-medium leading-[1.8]">
              <p>WorthAI uses the following third party services for critical functionality:</p>
              <div className="grid gap-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                   <h3 className="text-primary font-bold mb-2">Supabase</h3>
                   <p className="text-sm">Database, Authentication, and File Storage. Secured via SSL encryption.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                   <h3 className="text-primary font-bold mb-2">Groq</h3>
                   <p className="text-sm">AI inference processing for our financial model logic.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                   <h3 className="text-primary font-bold mb-2">Yahoo Finance</h3>
                   <p className="text-sm">Real-time and market stock price data for financial queries. No personal data is shared with Yahoo Finance.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">07.</span>
              Your Rights
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              You have the right to access, correct, or delete your personal data at any time. We believe you should own your future and your own data. Contact us at <a href="mailto:worthai.support@gmail.com" className="text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all font-bold">worthai.support@gmail.com</a> to exercise these rights.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">08.</span>
              Contact
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              For privacy concerns, contact our privacy officer at <a href="mailto:worthai.support@gmail.com" className="text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all font-bold">worthai.support@gmail.com</a>
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
