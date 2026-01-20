import type {
  NodeKind,
  NodeMetadata,
  PriceTriggerNodeMetadata,
  TimerNodeMetadata,
} from "@n8n-trading/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Input } from "./ui/input";
import { SUPPORTED_ASSETS } from "@n8n-trading/types";

const SUPPORTED_TRIGGERS = [
  {
    id: "timer",
    title: "Timer",
    description: "Run this trigger every X seconds/minutes/hours/days",
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description:
      "Run this trigger when a stock price crosses a certain threshold for an asset",
  },
];

export const TriggerSheet = ({
  onSelect,
  open,
  onOpenChange,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [metadata, setMetadata] = useState<
    PriceTriggerNodeMetadata | TimerNodeMetadata
  >({
    time: 3600,
  });
  const [selectedTrigger, setSelectedTrigger] = useState("");

  const handleCreate = () => {
    if (!selectedTrigger) return;
    onSelect(selectedTrigger as NodeKind, metadata);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-l border-neutral-800 bg-black text-neutral-50 sm:max-w-md">
        <SheetHeader className="gap-4 p-5">
          <div className="space-y-1">
            <SheetTitle className="text-base font-medium text-neutral-50">
              Select trigger
            </SheetTitle>
            <SheetDescription className="text-xs text-neutral-400">
              Choose how this workflow should start. You can always come back
              and adjust these parameters later.
            </SheetDescription>
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#f17463]">
              Trigger type
            </p>
            <Select
              onValueChange={(value) => setSelectedTrigger(value as string)}
            >
              <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-950 text-neutral-100">
                <SelectGroup>
                  <SelectLabel className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                    Select trigger
                  </SelectLabel>
                  {SUPPORTED_TRIGGERS.map((trigger) => (
                    <SelectItem
                      key={trigger.id}
                      value={trigger.id}
                      className="cursor-pointer text-sm text-neutral-100 focus:bg-neutral-800"
                    >
                      <div className="w-64 space-y-1">
                        <div className="font-medium text-neutral-50">
                          {trigger.title}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {trigger.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedTrigger === "timer" && (
            <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Interval
              </p>
              <p className="text-xs text-neutral-400">
                Number of seconds after which the trigger should run.
              </p>
              <Input
                type="number"
                value={(metadata as TimerNodeMetadata).time}
                onChange={(e) =>
                  setMetadata((current) => ({
                    ...current,
                    time: Number(e.target.value),
                  }))
                }
                className="mt-1 border-neutral-800 bg-neutral-900 text-sm text-neutral-100"
              />
            </div>
          )}

          {selectedTrigger === "price-trigger" && (
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Price threshold
                </p>
                <p className="text-xs text-neutral-400">
                  Run this workflow when the selected asset crosses this price.
                </p>
                <Input
                  type="number"
                  value={(metadata as PriceTriggerNodeMetadata).targetPrice}
                  onChange={(e) =>
                    setMetadata((current) => ({
                      ...current,
                      targetPrice: Number(e.target.value),
                    }))
                  }
                  className="mt-1 border-neutral-800 bg-neutral-900 text-sm text-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Asset
                </p>
                <Select
                  onValueChange={(value) =>
                    setMetadata((current) => ({
                      ...current,
                      asset: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-950 text-neutral-100">
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        Select asset
                      </SelectLabel>
                      {SUPPORTED_ASSETS.map((asset) => (
                        <SelectItem
                          key={asset}
                          value={asset}
                          className="cursor-pointer text-sm text-neutral-100 focus:bg-neutral-800"
                        >
                          <div className="w-64">
                            <div className="font-medium text-neutral-50">
                              {asset}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </SheetHeader>

        <SheetFooter className="border-t border-neutral-900 bg-black/90 p-4">
          <Button
            className="w-full cursor-pointer bg-white text-xs font-medium text-neutral-900 hover:bg-gray-200"
            disabled={!selectedTrigger}
            onClick={handleCreate}
          >
            Create trigger
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
