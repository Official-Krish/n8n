import type { ReactNode } from "react"

type UseCaseSkeletonVariant =
  | "research"
  | "backtest"
  | "execution"
  | "options"

interface UseCaseSkeletonProps {
  variant?: UseCaseSkeletonVariant
}

export const UseCaseSkeleton = ({ variant = "research" }: UseCaseSkeletonProps) => {
  const renderContent = (): ReactNode => {
    switch (variant) {
      case "backtest":
        return (
          <div className="relative flex h-full w-full flex-col justify-between gap-3 p-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 rounded-full bg-white/12" />
              <div className="h-3 w-10 rounded-full bg-white/10" />
              <div className="h-3 w-14 rounded-full bg-white/8" />
            </div>
            <div className="space-y-2 rounded-lg border border-white/5 bg-white/4 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-16 rounded bg-white/12" />
                  <div className="h-2 w-full rounded bg-white/6" />
                  <div className="h-2 w-10 rounded bg-white/12" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-14 rounded-full bg-white/10" />
              <div className="h-2 w-24 rounded-full bg-white/6" />
              <div className="ml-auto h-3 w-20 rounded-full bg-[#f17463]/30" />
            </div>
          </div>
        )
      case "execution":
        return (
          <div className="relative flex h-full w-full flex-col justify-between gap-3 p-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-24 rounded-full bg-white/12" />
              <div className="h-3 w-14 rounded-full bg-white/8" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/4 px-3 py-2"
                >
                  <div className="h-8 w-8 rounded-md bg-linear-to-br from-white/10 to-white/5" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/5 rounded bg-white/12" />
                    <div className="h-2 w-4/5 rounded bg-white/8" />
                  </div>
                  <div className="h-2.5 w-12 rounded-full bg-emerald-400/30" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-white/10" />
              <div className="h-2 w-16 rounded-full bg-white/8" />
            </div>
          </div>
        )
      case "options":
        return (
          <div className="relative flex h-full w-full flex-col justify-between gap-4 p-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-10 rounded-full bg-white/12" />
              <div className="h-3 w-16 rounded-full bg-white/10" />
              <div className="h-3 w-12 rounded-full bg-white/8" />
            </div>
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-white/5 bg-black/40">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end gap-2">
                <div className="h-6 w-1 rounded bg-white/14" />
                <div className="h-10 w-1 rounded bg-white/10" />
                <div className="h-8 w-1 rounded bg-white/12" />
                <div className="h-14 w-1 rounded bg-white/16" />
                <div className="h-9 w-1 rounded bg-white/12" />
                <div className="h-5 w-1 rounded bg-white/10" />
              </div>
              <div className="absolute inset-0">
                <svg viewBox="0 0 200 120" className="h-full w-full text-[#f17463]/60">
                  <path
                    d="M10 90 Q60 20 110 60 T190 50"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-white/10" />
              <div className="h-2 w-16 rounded-full bg-white/8" />
              <div className="h-2 w-10 rounded-full bg-white/6" />
            </div>
          </div>
        )
      case "research":
      default:
        return (
          <div className="relative flex h-full w-full flex-col justify-end gap-3 p-5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/10 ring-1 ring-white/10" />
              <div className="h-3 w-28 rounded-full bg-white/10" />
            </div>
            <div className="mt-1 flex items-end gap-2">
              <div className="h-10 w-4 rounded-md bg-white/10" />
              <div className="h-16 w-4 rounded-md bg-white/14" />
              <div className="h-12 w-4 rounded-md bg-white/10" />
              <div className="h-20 w-4 rounded-md bg-white/16" />
              <div className="h-14 w-4 rounded-md bg-white/12" />
              <div className="ml-auto h-7 w-24 rounded-full bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-3/5 rounded bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-white/8" />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative flex flex-1 w-full h-full min-h-24 overflow-hidden rounded-xl border border-white/10 bg-black">
      <div className="absolute inset-0 bg-dot-white/[0.12] bg-size-[12px_12px] opacity-70" />
      <div className="absolute -top-24 left-8 h-56 w-56 rounded-full bg-linear-to-br from-white/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-24 right-6 h-56 w-56 rounded-full bg-linear-to-br from-[#f17463]/12 to-transparent blur-3xl" />

      {renderContent()}

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 mask-[radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
    </div>
  )
}
