import { type ComponentPropsWithoutRef, type CSSProperties, type FC } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 300,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md",

        // Shine effect
        "animate-shiny-text [background-size:var(--shiny-width)_300%] bg-clip-text [background-position:0_0] [animation:shiny-text-animation_3s_infinite]",
        // Shine gradient
        "bg-gradient-to-r from-transparent via-100% to-transparent via-white",

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
