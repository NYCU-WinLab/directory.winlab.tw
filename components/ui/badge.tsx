import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        professor: "border-transparent bg-blue-500/15 text-blue-400 dark:bg-blue-500/20",
        phd: "border-transparent bg-violet-500/15 text-violet-400 dark:bg-violet-500/20",
        master: "border-transparent bg-emerald-500/15 text-emerald-400 dark:bg-emerald-500/20",
        undergraduate: "border-transparent bg-amber-500/15 text-amber-400 dark:bg-amber-500/20",
        alumni: "border-transparent bg-zinc-500/15 text-zinc-400 dark:bg-zinc-500/20",
        staff: "border-transparent bg-teal-500/15 text-teal-400 dark:bg-teal-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
