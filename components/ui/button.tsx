import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-emerald-brand text-white font-bold shadow-md shadow-[#006d34]/20 hover:opacity-90 hover:shadow-lg hover:shadow-[#006d34]/25 active:scale-[0.97]",
        outline: "border border-[#bbcbba]/60 bg-white text-[#5a6059] hover:bg-[#f0f5f1] hover:text-[#181d1b] hover:border-[#bbcbba]",
        ghost: "text-[#5a6059] hover:bg-[#eaefeb] hover:text-[#181d1b]",
        destructive: "bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20",
        secondary: "bg-[#eaefeb] text-[#5a6059] hover:bg-[#dde8de] hover:text-[#181d1b] border border-[#bbcbba]/40",
        link: "text-[#006d34] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-[15px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
