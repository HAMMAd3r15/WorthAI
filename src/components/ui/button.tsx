import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(201,168,76,0.2)]',
      secondary: 'bg-surface text-foreground hover:bg-surface/80 border border-white/10',
      outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
      ghost: 'bg-transparent hover:bg-white/5 text-foreground',
      danger: 'bg-danger text-white hover:bg-danger/90',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 relative overflow-hidden group',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_0.75s_forwards] -skew-x-12" />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
