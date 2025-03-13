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
    <div>
      <div className="flex flex-wrap">
        {/* Left Column */}
        <div className="w-1/2 mb-6 ">
          {/* Payment Amount */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <Label
                htmlFor="paymentAmount"
                className="text-sm font-medium"
              >
                Payment Amount ($)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
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
            <div className="flex h-10 w-full max-w-[300px]">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
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

          {/* Application Fee */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Label className="text-sm font-medium">Application Fee</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-xs">
                      The fee your platform charges on each transaction. This
                      fee is taken from the connected account and transferred to
                      your platform. For marketplaces, this is typically your
                      commission or service fee.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
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
                  className="text-xs cursor-pointer"
                >
                  Fixed amount
                </Label>
              </div>

              <div className="flex items-center gap-1">
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
                  className="text-xs cursor-pointer"
                >
                  Percentage
                </Label>
              </div>
            </div>

            {formData.applicationFeeType === "fixed" ? (
              <div className="flex h-10 w-full max-w-[300px]">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
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
              <div className="flex h-10 w-full max-w-[300px]">
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
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  %
                </span>
              </div>
            )}

            {/* Connected Account Fee Option - Only show when Platform handles pricing is selected */}
            {formData.feeHandling === "platform" && (
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="connectedAccountFee"
                  checked={formData.includeConnectedAccountFee}
                  onCheckedChange={(checked) =>
                    onChange({ includeConnectedAccountFee: checked })
                  }
                />
                <Label
                  htmlFor="connectedAccountFee"
                  className="text-xs cursor-pointer flex items-center gap-1"
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
                          connected account. This fee is prorated in this
                          simulation.
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
        <div className="w-1/2 mb-6">
          {/* Fee Handling Model */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <Label className="text-sm font-medium">Fee Handling Model</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-xs">
                      Choose who is responsible for paying Stripe's processing
                      fees. With "Stripe handles pricing", fees are deducted
                      from the connected account's funds. With "Platform handles
                      pricing", the platform absorbs the fees.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex gap-2">
              <div
                className={`text-center py-2 px-3 text-sm border flex-1 ${
                  formData.feeHandling === "stripe"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                } cursor-pointer rounded-md`}
                onClick={() => onChange({ feeHandling: "stripe" })}
              >
                Stripe handles pricing
              </div>
              <div
                className={`text-center py-2 px-3 text-sm border flex-1 ${
                  formData.feeHandling === "platform"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                } cursor-pointer rounded-md`}
                onClick={() => onChange({ feeHandling: "platform" })}
              >
                Platform handles pricing
              </div>
            </div>
          </div>

          {/* Stripe Fee Settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">
                  Stripe Fee Settings
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        Stripe's processing fees vary by region and card type.
                        <br />
                        <br />
                        <strong>US rates:</strong> 2.9% + $0.30 per successful
                        card charge
                        <br />
                        <strong>EU rates:</strong> 1.5% + €0.25 for European
                        cards
                        <br />
                        <br />
                        Custom rates may apply for high-volume businesses.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className={`text-xs px-2 py-1 rounded-md cursor-pointer ${
                      formData.feeRegion === "us"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setRegionFees("us")}
                  >
                    US
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-md cursor-pointer ${
                      formData.feeRegion === "eu"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setRegionFees("eu")}
                  >
                    EU
                  </div>
                </div>
              </div>
            </div>

            <div className="flex mb-2 w-full">
              <div className="mr-6 w-1/2">
                <div className="text-xs text-gray-500 mb-1">Percentage Fee</div>
                <div className="flex h-10 w-full max-w-[180px]">
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
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="w-1/2">
                <div className="text-xs text-gray-500 mb-1">Fixed Fee</div>
                <div className="flex h-10 w-full max-w-[180px]">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    {formData.feeRegion === "eu" ? "€" : "$"}
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
                className="text-xs cursor-pointer"
              >
                Include 1% international card fee
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Account Negotiated Rate */}
      {formData.accountType === "custom" && (
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <span>Negotiated Rate (Custom accounts only)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-gray-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="text-xs">
                    Custom Connect accounts with high volume may negotiate lower
                    processing rates with Stripe.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex h-10 w-[180px]">
            <Input
              id="negotiatedStripeFee"
              type="number"
              min="0"
              step="0.1"
              value={formData.negotiatedStripeFee || ""}
              onChange={(e) =>
                onChange({
                  negotiatedStripeFee: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Leave blank for standard rate"
              className="rounded-r-none text-sm h-full"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              %
            </span>
          </div>
        </div>
      )}

      {/* Express Account Payout Timing */}
      {formData.accountType === "express" && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <Label className="text-sm font-medium">Payout Timing</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="text-xs">
                    Express accounts can choose between standard payouts (2-3
                    days) or instant payouts (with a 1% fee, minimum $0.50).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1">
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
                className="text-xs cursor-pointer"
              >
                Standard (2-3 days)
              </Label>
            </div>

            <div className="flex items-center gap-1">
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
                className="text-xs cursor-pointer"
              >
                Instant (1% fee, min $0.50)
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
