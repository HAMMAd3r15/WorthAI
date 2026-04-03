import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { WorthLogo } from '@/components/ui/worth-logo'

export default function ContactPage() {
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
            <Mail className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">Contact Us</h1>
          <p className="text-secondary font-medium uppercase tracking-[0.2em] text-xs opacity-60">We&apos;re here to help</p>
        </header>

        <div className="space-y-16">
          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">01.</span>
              Reach Out
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium">
              Whether you have a question about WorthAI, need help with your account, want to report a bug, or just want to share feedback — we&apos;d love to hear from you. Our team is committed to responding to all inquiries in a timely manner.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">02.</span>
              Email
            </h2>
            <a 
              href="mailto:worthai.support@gmail.com"
              className="block p-10 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 group/card"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 group-hover/card:bg-primary/20 transition-colors duration-500">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-secondary/50 uppercase tracking-[0.2em] font-bold mb-2">Email Address</p>
                  <p className="text-2xl text-primary font-bold tracking-tight group-hover/card:underline underline-offset-4 decoration-primary/30 transition-all">worthai.support@gmail.com</p>
                </div>
              </div>
            </a>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">03.</span>
              What We Can Help With
            </h2>
            <div className="space-y-4 text-lg text-secondary/90 font-medium leading-relaxed">
              <ul className="grid gap-4 bg-white/5 p-8 rounded-2xl border border-white/5">
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Account issues, login problems, or data deletion requests</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Bug reports and technical issues with the platform</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>General questions about how WorthAI works</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Feature requests and product feedback</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Privacy concerns and data-related inquiries</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Partnership and business inquiries</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group">
            <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-xs opacity-30 text-white font-black shrink-0">04.</span>
              Response Time
            </h2>
            <p className="text-lg leading-[1.8] text-secondary/90 font-medium bg-primary/5 p-8 rounded-2xl border border-primary/20">
              We aim to respond to all inquiries within <span className="text-white font-bold">24–48 business hours</span>. For urgent account-related matters such as security concerns or data deletion requests, please include &quot;URGENT&quot; in your email subject line so we can prioritize accordingly.
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
