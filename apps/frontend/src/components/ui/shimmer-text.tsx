export const title = "Shimmering Text"

import { cn } from "@/lib/utils"
import { type HTMLMotionProps, motion, type Transition } from "motion/react"
import type * as React from "react"

type ShimmeringTextProps = {
    text: string
    duration?: number
    transition?: Transition
    wave?: boolean
    color?: string
    shimmeringColor?: string
} & Omit<HTMLMotionProps<"span">, "children">

function ShimmeringText({
    text,
    duration = 0.3,
    transition,
    className,
    color = "#ff6a4a",
    shimmeringColor = "#ffffff",
    wave = false,
    ...props
}: ShimmeringTextProps) {
    return (
        <motion.span
            className={cn("relative inline-block perspective-[600px]", className)}
            style={
                {
                    "--shimmering-color": shimmeringColor,
                    "--color": color,
                    color: "var(--color)",
                } as React.CSSProperties
            }
            {...(props as any)}
        >
            {text?.split("")?.map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block whitespace-pre transform-3d"
                    animate={{
                        color: [
                            "var(--color)", 
                            "var(--shimmering-color)",
                            "var(--color)",
                        ],
                        ...(wave
                            ? {
                                  y: [0, -2, 0],
                                  rotateX: [0, -8, 0],
                              }
                            : {}),
                    }}
                    transition={{
                        duration,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: text.length * 0.04,
                        delay: (i * duration) / text.length,
                        ease: "easeInOut",
                        ...transition,
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    )
}

export { ShimmeringText, type ShimmeringTextProps }
export default ShimmeringText