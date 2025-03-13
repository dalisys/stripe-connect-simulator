"use client";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

export default function FeeHandlingSelector({
  value,
  onChange,
  disabled = {},
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-sm font-medium">Fee Handling Model</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Choose who handles the Stripe processing fees:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>
                    <strong>Stripe handles pricing:</strong> Stripe deducts fees
                    from the connected account
                  </li>
                  <li>
                    <strong>Platform handles pricing:</strong> Your platform
                    absorbs the fees, connected account receives full amount
                    minus application fee
                  </li>
                </ul>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          className={`border rounded-md p-2 text-center ${
            disabled.stripe
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer " +
                (value === "stripe"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200")
          }`}
          onClick={() => !disabled.stripe && onChange("stripe")}
        >
          <div className="text-sm font-semibold">Stripe handles pricing</div>
          <div className="text-xs text-gray-500">
            Fees deducted from connected account
          </div>
        </div>

        <div
          className={`border rounded-md p-2 text-center ${
            disabled.platform
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer " +
                (value === "platform"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200")
          }`}
          onClick={() => !disabled.platform && onChange("platform")}
        >
          <div className="text-sm font-semibold">Platform handles pricing</div>
          <div className="text-xs text-gray-500">
            Platform absorbs Stripe fees
          </div>
        </div>
      </div>
    </div>
  );
}
