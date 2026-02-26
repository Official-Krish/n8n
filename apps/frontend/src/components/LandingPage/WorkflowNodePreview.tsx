import { cn } from "@/lib/utils"

type WorkflowNodePreviewProps = {
  kind: "trigger" | "condition" | "action" | "reporting"
  title: string
  subtitle: string
  badges?: string[]
}

const toneByKind: Record<WorkflowNodePreviewProps["kind"], string> = {
  trigger: "text-[#f17463]",
  condition: "text-emerald-300",
  action: "text-sky-300",
  reporting: "text-violet-300",
}

const handleColorByKind: Record<WorkflowNodePreviewProps["kind"], string> = {
  trigger: "bg-[#f17463]",
  condition: "bg-emerald-400",
  action: "bg-sky-400",
  reporting: "bg-violet-400",
}

export const WorkflowNodePreview = ({
  kind,
  title,
  subtitle,
  badges = [],
}: WorkflowNodePreviewProps) => {
  return (
    <div className="absolute inset-0 p-4">
      <div className="relative mx-auto mt-2 max-w-[320px] rounded-2xl border border-neutral-700/80 bg-neutral-950/95 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.18em]",
              toneByKind[kind]
            )}
          >
            {kind}
          </span>
          <div className="flex items-center gap-1.5">
            {badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-neutral-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 text-sm font-medium text-neutral-100">{title}</div>
        <div className="mt-1 text-[11px] text-neutral-400">{subtitle}</div>
        <span
          className={cn(
            "absolute -right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-neutral-900",
            handleColorByKind[kind]
          )}
        />
      </div>
    </div>
  )
}
