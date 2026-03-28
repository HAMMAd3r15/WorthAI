import { Hero } from "@/components/landing/hero"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FeatureShuffle } from "@/components/landing/feature-shuffle"
import { FAQ } from "@/components/landing/faq"
import { Pricing } from "@/components/landing/sections"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary selection:text-black">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0D14]/80 backdrop-blur-xl">
        <div className="max-w-[1100px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-josefin font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
            WORTH
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-[11px] font-bold tracking-[0.25em] uppercase text-secondary/60 hover:text-primary transition-all hover:translate-y-[-1px] font-josefin">
              Features
            </a>
            <a href="#pricing" className="text-[11px] font-bold tracking-[0.25em] uppercase text-secondary/60 hover:text-primary transition-all hover:translate-y-[-1px] font-josefin">
              Pricing
            </a>
            <Link href="/login">
              <button className="px-8 py-2.5 rounded-full border border-primary/20 bg-primary/2 bg-transparent text-primary text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 font-josefin">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <TestimonialsSection />
      
      <div id="features" className="relative z-10">
        <FeatureShuffle />
      </div>

      <FAQ />
      
      <div id="pricing" className="relative z-10">
        <Pricing />
      </div>
      
      <Footer />
    </main>
  );
}
