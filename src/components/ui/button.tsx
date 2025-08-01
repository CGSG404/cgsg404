import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casino-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-casino-dark disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-dark hover:shadow-lg hover:shadow-casino-neon-green/25 active:scale-95",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 active:scale-95",
        outline: "border-2 border-casino-neon-green text-casino-neon-green bg-transparent hover:bg-casino-neon-green hover:text-casino-dark hover:shadow-lg hover:shadow-casino-neon-green/25 active:scale-95",
        secondary: "bg-casino-card-bg text-casino-text-primary border border-casino-border-subtle hover:bg-casino-card-hover hover:border-casino-border-accent active:scale-95",
        ghost: "text-casino-text-secondary hover:bg-casino-surface hover:text-casino-text-primary active:scale-95",
        link: "text-casino-neon-green underline-offset-4 hover:underline hover:text-casino-neon-green-light",
        gradient: "bg-gradient-to-r from-casino-neon-green to-casino-neon-blue text-white hover:from-casino-neon-green-dark hover:to-blue-600 hover:shadow-lg hover:shadow-casino-neon-green/25 active:scale-95",
        neon: "bg-casino-dark border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark hover:shadow-[0_0_20px_rgba(0,255,153,0.5)] active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base rounded-xl",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
