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

export default function AccountTypeSelector({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-sm font-medium">Account Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Stripe Connect offers three account types with different
                features and fee structures:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>
                    <strong>Standard:</strong> Quick setup, Stripe manages
                    compliance
                  </li>
                  <li>
                    <strong>Express:</strong> Balanced, customizable onboarding,
                    Stripe manages most compliance
                  </li>
                  <li>
                    <strong>Custom:</strong> Full control, negotiated fees, you
                    handle compliance
                  </li>
                </ul>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div
          className={`border rounded-md p-2 text-center cursor-pointer ${
            value === "standard"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => onChange("standard")}
        >
          <div className="text-sm font-semibold">Standard</div>
          <div className="text-xs text-gray-500">Lightest integration</div>
        </div>

        <div
          className={`border rounded-md p-2 text-center cursor-pointer ${
            value === "express"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => onChange("express")}
        >
          <div className="text-sm font-semibold">Express</div>
          <div className="text-xs text-gray-500">Balanced integration</div>
        </div>

        <div
          className={`border rounded-md p-2 text-center cursor-pointer ${
            value === "custom"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => onChange("custom")}
        >
          <div className="text-sm font-semibold">Custom</div>
          <div className="text-xs text-gray-500">Fully customizable</div>
        </div>
      </div>
    </div>
  );
}
