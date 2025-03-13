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

export default function ChargeTypeSelector({
  value,
  onChange,
  disabled = {},
  accountType,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-sm font-medium">Charge Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Stripe Connect offers different charge types that determine how
                the payment flows between platform, connected accounts, and
                Stripe:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>
                    <strong>Direct:</strong> Charge happens on the connected
                    account, funds flow directly to them
                  </li>
                  <li>
                    <strong>Destination:</strong> Charge happens on your
                    platform, funds automatically transfer to connected account
                  </li>
                  <li>
                    <strong>Separate:</strong> Separate charges to both platform
                    and connected account
                  </li>
                </ul>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div
          className={`border rounded-md p-2 text-center ${
            disabled.direct
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer " +
                (value === "direct"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200")
          }`}
          onClick={() => !disabled.direct && onChange("direct")}
        >
          <div className="text-sm font-semibold">Direct</div>
          <div className="text-xs text-gray-500">
            Directly on connected account
          </div>
        </div>

        <div
          className={`border rounded-md p-2 text-center ${
            disabled.destination
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer " +
                (value === "destination"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200")
          }`}
          onClick={() => !disabled.destination && onChange("destination")}
        >
          <div className="text-sm font-semibold">Destination</div>
          <div className="text-xs text-gray-500">
            Platform to connected account
          </div>
        </div>

        <div
          className={`border rounded-md p-2 text-center ${
            disabled.separate
              ? "opacity-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer " +
                (value === "separate"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200")
          }`}
          onClick={() => !disabled.separate && onChange("separate")}
        >
          <div className="text-sm font-semibold">Separate</div>
          <div className="text-xs text-gray-500">Charges to both parties</div>
        </div>
      </div>
    </div>
  );
}
