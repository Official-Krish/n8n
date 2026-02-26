import { Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ComingSoonModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
}

export const ComingSoonModal = ({
  open,
  onOpenChange,
  title,
  description,
}: ComingSoonModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-neutral-700 bg-neutral-900 text-neutral-100">
        <DialogHeader>
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#f17463]/35 bg-[#f17463]/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-[#ffb2a5] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Coming soon
          </div>
          <DialogTitle className="text-xl text-white">{title}</DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 flex justify-end">
          <Button
            className="bg-white text-neutral-900 hover:bg-neutral-200 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
