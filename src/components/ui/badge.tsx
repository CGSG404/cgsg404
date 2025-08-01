import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-casino-neon-green focus:ring-offset-2 focus:ring-offset-casino-dark",
  {
    variants: {
      variant: {
        default: "bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-dark hover:shadow-lg hover:shadow-casino-neon-green/25",
        secondary: "bg-casino-surface text-casino-text-secondary border border-casino-border-subtle hover:bg-casino-surface-elevated hover:text-casino-text-primary",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25",
        outline: "border border-casino-neon-green text-casino-neon-green bg-transparent hover:bg-casino-neon-green hover:text-casino-dark",
        success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25",
        warning: "bg-casino-neon-orange text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/25",
        info: "bg-casino-neon-blue text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25",
        neon: "bg-casino-dark border border-casino-neon-green text-casino-neon-green hover:shadow-[0_0_10px_rgba(0,255,153,0.5)]",
        gradient: "bg-gradient-to-r from-casino-neon-green to-casino-neon-blue text-white hover:from-casino-neon-green-dark hover:to-blue-600",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
