"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

export default function PaymentInputForm({ formData, onChange }) {
  // Helper function to set region-specific fees
  const setRegionFees = (region) => {
    if (region === "eu") {
      onChange({
        feeRegion: "eu",
        stripeFee: 1.5,
        stripeFeeFixed: 0.25,
      });
    } else {
      onChange({
        feeRegion: "us",
        stripeFee: 2.9,
        stripeFeeFixed: 0.3,
      });
    }
  };

  // Set EU as initial state if feeRegion is not set
  useState(() => {
    if (!formData.feeRegion) {
      setRegionFees("eu");
    }
  }, []);

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="mt-10 space-y-8">
          {/* Payment Amount Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label
                  htmlFor="paymentAmount"
                  className="text-xs text-gray-500"
                >
                  Payment Amount ($)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        The total amount charged to the customer for this
                        transaction.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex h-10 w-full rounded-md">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                $
              </span>
              <Input
                id="paymentAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.paymentAmount}
                onChange={(e) =>
                  onChange({ paymentAmount: parseFloat(e.target.value) || 0 })
                }
                className="rounded-l-none text-sm h-full"
              />
            </div>
          </div>

          {/* Application Fee Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">Application Fee</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        The fee your platform charges on each transaction.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="fixed-fee"
                  name="applicationFeeType"
                  checked={formData.applicationFeeType === "fixed"}
                  onChange={() => onChange({ applicationFeeType: "fixed" })}
                  className="w-3 h-3"
                />
                <Label
                  htmlFor="fixed-fee"
                  className="text-xs"
                >
                  Fixed amount
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="percent-fee"
                  name="applicationFeeType"
                  checked={formData.applicationFeeType === "percent"}
                  onChange={() => onChange({ applicationFeeType: "percent" })}
                  className="w-3 h-3"
                />
                <Label
                  htmlFor="percent-fee"
                  className="text-xs"
                >
                  Percentage
                </Label>
              </div>
            </div>

            {formData.applicationFeeType === "fixed" ? (
              <div className="flex h-10 w-full rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                  $
                </span>
                <Input
                  id="applicationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.applicationFee}
                  onChange={(e) =>
                    onChange({
                      applicationFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="rounded-l-none text-sm h-full"
                />
              </div>
            ) : (
              <div className="flex h-10 w-full rounded-md">
                <Input
                  id="applicationFeePercent"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.applicationFeePercent}
                  onChange={(e) =>
                    onChange({
                      applicationFeePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="rounded-r-none text-sm h-full"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                  %
                </span>
              </div>
            )}

            {formData.feeHandling === "platform" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="connectedAccountFee"
                  checked={formData.includeConnectedAccountFee}
                  onCheckedChange={(checked) =>
                    onChange({ includeConnectedAccountFee: checked })
                  }
                />
                <Label
                  htmlFor="connectedAccountFee"
                  className="text-xs flex items-center gap-1"
                >
                  <span>$2 per active connected account monthly</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">
                          Stripe charges a $2 monthly fee for each active
                          connected account.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stripe Processing Fee Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">
                  Stripe Processing Fee
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        Stripe's standard processing fee for online payments.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    formData.feeRegion === "us"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setRegionFees("us")}
                >
                  US
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    formData.feeRegion === "eu"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setRegionFees("eu")}
                >
                  EU
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Percentage Fee</Label>
                <div className="flex h-10 w-full rounded-md">
                  <Input
                    id="stripeFee"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.stripeFee}
                    onChange={(e) =>
                      onChange({ stripeFee: parseFloat(e.target.value) || 0 })
                    }
                    className="rounded-r-none text-sm h-full"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Fixed Fee</Label>
                <div className="flex h-10 w-full rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                    $
                  </span>
                  <Input
                    id="stripeFeeFixed"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.stripeFeeFixed}
                    onChange={(e) =>
                      onChange({
                        stripeFeeFixed: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="rounded-l-none text-sm h-full"
                  />
                </div>
              </div>
            </div>

            {formData.accountType === "custom" && (
              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-1">
                  <Label
                    htmlFor="negotiatedFee"
                    className="text-xs font-medium"
                  >
                    Negotiated Rate (%)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">
                          Custom accounts can negotiate lower processing fees
                          with Stripe.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex h-10 w-full rounded-md">
                  <Input
                    id="negotiatedFee"
                    type="number"
                    min="0"
                    step="0.1"
                    value={
                      formData.negotiatedStripeFee !== null
                        ? formData.negotiatedStripeFee
                        : ""
                    }
                    placeholder="Optional"
                    onChange={(e) => {
                      const value = e.target.value;
                      onChange({
                        negotiatedStripeFee:
                          value === "" ? null : parseFloat(value) || 0,
                      });
                    }}
                    className="rounded-r-none text-sm h-full"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-sm h-full">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Options Section */}
          <div className="space-y-4 pt-6">
            <Label className="text-sm font-medium">Additional Options</Label>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="internationalFee"
                  checked={formData.includeInternationalFee}
                  onCheckedChange={(checked) =>
                    onChange({ includeInternationalFee: checked })
                  }
                />
                <Label
                  htmlFor="internationalFee"
                  className="text-xs flex items-center gap-1"
                >
                  <span>Include international card fee (+1%)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">
                          Additional 1% for processing international cards.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="monthlyFee"
                  checked={formData.includeMonthlyFee}
                  onCheckedChange={(checked) =>
                    onChange({ includeMonthlyFee: checked })
                  }
                />
                <Label
                  htmlFor="monthlyFee"
                  className="text-xs flex items-center gap-1"
                >
                  <span>Include monthly fee (prorated)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">
                          Monthly fees prorated for this transaction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>
            </div>

            {/* Payout Timing Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Payout Timing</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        Choose between standard or instant payouts.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="standard-payout"
                    name="payoutTiming"
                    checked={formData.payoutTiming === "standard"}
                    onChange={() => onChange({ payoutTiming: "standard" })}
                    className="w-3 h-3"
                  />
                  <Label
                    htmlFor="standard-payout"
                    className="text-xs"
                  >
                    Standard (2 days)
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="instant-payout"
                    name="payoutTiming"
                    checked={formData.payoutTiming === "instant"}
                    onChange={() => onChange({ payoutTiming: "instant" })}
                    className="w-3 h-3"
                  />
                  <Label
                    htmlFor="instant-payout"
                    className="text-xs"
                  >
                    Instant (+1% fee)
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
