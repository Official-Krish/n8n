import type {
  NodeKind,
  NodeMetadata,
  TradingMetadata,
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

const SUPPORTED_ACTIONS = [
  {
    id: "zerodha",
    title: "Zerodha",
    description: "Execute an order on Zerodha",
  },
  {
    id: "groww",
    title: "Groww",
    description: "Execute an order on Groww",
  },
];

export const ActionSheet = ({
  onSelect,
  open,
  onOpenChange,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [metadata, setMetadata] = useState<TradingMetadata | {}>({});
  const [selectedAction, setSelectedAction] = useState("");

  const handleCreate = () => {
    if (!selectedAction) return;
    onSelect(selectedAction as NodeKind, metadata);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-l border-neutral-800 bg-black text-neutral-50 sm:max-w-md">
        <SheetHeader className="gap-4 p-5">
          <div className="space-y-1">
            <SheetTitle className="text-base font-medium text-neutral-50">
              Select broker action
            </SheetTitle>
            <SheetDescription className="text-xs text-neutral-400">
              Connect this step of your workflow to a live brokerage
              integration.
            </SheetDescription>
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#f17463]">
              Broker
            </p>
            <Select
              onValueChange={(value) => setSelectedAction(value as string)}
            >
              <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-950 text-neutral-100">
                <SelectGroup>
                  <SelectLabel className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                    Select action
                  </SelectLabel>
                  {SUPPORTED_ACTIONS.map((action) => (
                    <SelectItem
                      key={action.id}
                      value={action.id}
                      className="cursor-pointer text-sm text-neutral-100 focus:text-neutral-100 focus:bg-neutral-800"
                    >
                      <div className="w-64 space-y-1">
                        <div className="font-medium text-neutral-50">
                          {action.title}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {action.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(selectedAction === "zerodha" || selectedAction === "groww") && (
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Order type
                </p>
                <Select
                  onValueChange={(value) =>
                    setMetadata((current) => ({
                      ...current,
                      type: value as "buy" | "sell",
                    }))
                  }
                >
                  <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-950 text-neutral-100">
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        Type
                      </SelectLabel>
                      <SelectItem
                        value="buy"
                        className="cursor-pointer text-sm text-neutral-100 focus:text-neutral-100 focus:bg-neutral-800"
                      >
                        Buy
                      </SelectItem>
                      <SelectItem
                        value="sell"
                        className="cursor-pointer text-sm text-neutral-100 focus:text-neutral-100 focus:bg-neutral-800"
                      >
                        Sell
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Symbol
                </p>
                <Select
                  onValueChange={(value) =>
                    setMetadata((current) => ({
                      ...current,
                      symbol: value as (typeof SUPPORTED_ASSETS)[number],
                    }))
                  }
                >
                  <SelectTrigger className="w-full border-neutral-800 bg-neutral-900 text-sm text-neutral-100">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-950 text-neutral-100">
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        Assets
                      </SelectLabel>
                      {SUPPORTED_ASSETS.map((asset) => (
                        <SelectItem
                          key={asset}
                          value={asset}
                          className="cursor-pointer text-sm text-neutral-100 focus:text-neutral-100 focus:bg-neutral-800"
                        >
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Quantity
                </p>
                <p className="text-xs text-neutral-400">
                  Number of units you want this action to trade when executed.
                </p>
                <Input
                  type="number"
                  value={(metadata as TradingMetadata).qty}
                  onChange={(e) =>
                    setMetadata((current) => ({
                      ...current,
                      qty: Number(e.target.value),
                    }))
                  }
                  className="mt-1 border-neutral-800 bg-neutral-900 text-sm text-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  API key
                </p>
                <p className="text-xs text-neutral-400">
                  Your broker API key used only when this node runs.
                </p>
                <Input
                  type="text"
                  value={(metadata as TradingMetadata).apiKey}
                  onChange={(e) =>
                    setMetadata((current) => ({
                      ...current,
                      apiKey: e.target.value,
                    }))
                  }
                  className="mt-1 border-neutral-800 bg-neutral-900 text-sm text-neutral-100"
                />
              </div>
            </div>
          )}
        </SheetHeader>
        <SheetFooter className="border-t border-neutral-900 bg-black/90 p-4">
          <Button
            className="w-full cursor-pointer bg-white text-xs font-medium text-neutral-900 hover:bg-gray-200"
            disabled={!selectedAction}
            onClick={handleCreate}
          >
            Create action
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};