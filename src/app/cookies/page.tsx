import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'
import { WorthLogo } from '@/components/ui/worth-logo'

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-background font-josefin text-foreground/90 selection:bg-primary/30 selection:text-white">
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
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
            <Cookie className="w-3 h-3 text-primary animate-bounce" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Session Policy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">Cookie Policy</h1>
          <p className="text-secondary font-medium uppercase tracking-[0.2em] text-xs opacity-60">Last updated: March 28, 2026</p>
        </header>

        <div className="space-y-16">
          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">01.</span>
              What Are Cookies
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              Cookies are small text files stored on your device that help websites remember information about your visit. They act as a digital memory for your browser, allowing us to recognize your session and keep you authenticated.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">02.</span>
              Cookies We Use
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium bg-primary/5 p-8 rounded-2xl border border-primary/20">
              WorthAI uses <span className="text-white font-bold">only essential cookies</span> required for the service to function. These include authentication session cookies that keep you logged in. We do not use advertising, tracking, or analytics cookies. We believe in high-utility, zero-tracking software.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">03.</span>
              Essential Cookies
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary">Cookie Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary">Purpose</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-secondary/90 font-medium">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-6 font-mono text-sm">auth-token</td>
                    <td className="px-6 py-6">Keeps you logged in consistently during your session.</td>
                    <td className="px-6 py-6 text-xs uppercase opacity-60">Session</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-6 font-mono text-sm">supabase-auth</td>
                    <td className="px-6 py-6">Maintains secure authentication state across page reloads.</td>
                    <td className="px-6 py-6 text-xs uppercase opacity-60">7 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">04.</span>
              Managing Cookies
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              You can control cookies through your browser settings. Most browsers allow you to block all cookies or notify you when one is being set. <span className="text-white font-bold">Disabling essential cookies will prevent you from logging into WorthAI or accessing your financial dashboard.</span>
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">05.</span>
              Contact
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              For questions regarding our minimal cookie usage, contact us at <a href="mailto:worthai.support@gmail.com" className="text-primary hover:underline underline-offset-4 decoration-primary/30 transition-all font-bold">worthai.support@gmail.com</a>
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
