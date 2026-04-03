import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-32 border-t border-primary/20 bg-[#0A0D14] relative z-10">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-josefin font-bold tracking-tighter text-primary uppercase mb-8 block">WorthAI</span>
            <p className="text-secondary text-lg leading-relaxed font-josefin max-w-sm">
              The context-aware AI financial advisor for the next generation. 
              Designed for clarity, built for wisdom.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Product</h4>
            <ul className="space-y-4 font-josefin text-secondary">
              <li><a href="#features" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Pricing</a></li>
              <li><Link href="/about" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Legal</h4>
            <ul className="space-y-4 font-josefin text-secondary">
              <li><Link href="/terms" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center text-[10px] text-secondary/30 uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} WorthAI Inc. &nbsp; | &nbsp; Own your future
        </div>
      </div>
    </footer>
  )
}
