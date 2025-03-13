"use client";

import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

export default function ConnectGuideToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Connect Guide Validation</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                When enabled, this will enforce the rules from the Stripe
                Connect integration guide. Certain combinations of account
                types, charge types, and fee handling models will be restricted
                based on Stripe's recommendations.
                <br />
                <a
                  href="https://docs.stripe.com/connect/design-an-integration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-1 inline-block"
                >
                  Learn more in the Stripe docs
                </a>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        aria-label="Toggle Connect Guide Validation"
      />
    </div>
  );
}
