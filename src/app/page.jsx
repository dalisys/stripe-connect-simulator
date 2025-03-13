"use client";

import { useState, useEffect } from "react";
import PaymentInputForm from "../components/PaymentInputForm";
import AccountTypeSelector from "../components/AccountTypeSelector";
import ChargeTypeSelector from "../components/ChargeTypeSelector";
import FeeHandlingSelector from "../components/FeeHandlingSelector";
import FeeCalculator from "../components/FeeCalculator";
import PaymentFlowDiagram from "../components/PaymentFlowDiagram";
import ConnectGuideToggle from "../components/ConnectGuideToggle";

export default function Home() {
  const [formData, setFormData] = useState({
    paymentAmount: 100,
    accountType: "standard",
    chargeType: "direct",
    feeHandling: "stripe",
    applicationFeeType: "fixed",
    applicationFee: 2,
    applicationFeePercent: 5,
    stripeFee: 1.5,
    stripeFeeFixed: 0.25,
    negotiatedStripeFee: null,
    includeInternationalFee: false,
    includeMonthlyFee: true,
    includeConnectedAccountFee: true,
    payoutTiming: "standard",
    connectGuideValidation: true, // Default to enabled
  });

  // Determine which options should be disabled based on the current configuration
  const [disabledOptions, setDisabledOptions] = useState({
    chargeTypes: {
      direct: false,
      destination: false,
      separate: false,
    },
    feeHandling: {
      stripe: false,
      platform: false,
    },
  });

  // Update disabled options when relevant form data changes
  useEffect(() => {
    if (formData.connectGuideValidation) {
      // Apply Stripe Connect guide validation rules
      const newDisabledOptions = {
        chargeTypes: {
          direct: formData.accountType === "express",
          destination:
            formData.accountType === "standard" &&
            formData.connectGuideValidation,
          separate:
            formData.accountType === "standard" &&
            formData.connectGuideValidation,
        },
        feeHandling: {
          stripe:
            (formData.accountType === "express" &&
              formData.connectGuideValidation) ||
            ((formData.chargeType === "destination" ||
              formData.chargeType === "separate") &&
              formData.connectGuideValidation),
          platform: false,
        },
      };
      setDisabledOptions(newDisabledOptions);

      // Auto-correct invalid combinations
      let updatedData = { ...formData };
      let needsUpdate = false;

      // If current charge type is disabled, switch to an allowed one
      if (newDisabledOptions.chargeTypes[formData.chargeType]) {
        if (formData.accountType === "standard") {
          updatedData.chargeType = "direct";
          needsUpdate = true;
        } else if (formData.accountType === "express") {
          updatedData.chargeType = "destination";
          needsUpdate = true;
        }
      }

      // If current fee handling is disabled, switch to an allowed one
      if (newDisabledOptions.feeHandling[formData.feeHandling]) {
        updatedData.feeHandling = "platform";
        needsUpdate = true;
      }

      if (needsUpdate) {
        setFormData(updatedData);
      }
    } else {
      // No validation, all options enabled
      setDisabledOptions({
        chargeTypes: {
          direct: false,
          destination: false,
          separate: false,
        },
        feeHandling: {
          stripe: false,
          platform: false,
        },
      });
    }
  }, [
    formData.accountType,
    formData.chargeType,
    formData.connectGuideValidation,
  ]);

  const handleFormChange = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const calculatedFees = FeeCalculator(formData);

  return (
    <div className="max-w-full">
      {/* Configuration Section - Top Row */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap">
          {/* Account Configuration */}
          <div className="w-full md:w-[40%] pr-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">Account Configuration</h2>
              <ConnectGuideToggle
                value={formData.connectGuideValidation}
                onChange={(value) =>
                  handleFormChange({ connectGuideValidation: value })
                }
              />
            </div>
            <div className="space-y-4">
              <AccountTypeSelector
                value={formData.accountType}
                onChange={(value) => handleFormChange({ accountType: value })}
              />
              <ChargeTypeSelector
                value={formData.chargeType}
                onChange={(value) => handleFormChange({ chargeType: value })}
                disabled={disabledOptions.chargeTypes}
                accountType={formData.accountType}
              />
              <FeeHandlingSelector
                value={formData.feeHandling}
                onChange={(value) => handleFormChange({ feeHandling: value })}
                disabled={disabledOptions.feeHandling}
              />
            </div>
          </div>

          {/* Payment Parameters */}
          <div className="w-full md:w-[60%]">
            <h2 className="text-base font-semibold mb-3">Payment Parameters</h2>
            <PaymentInputForm
              formData={formData}
              onChange={handleFormChange}
            />
          </div>
        </div>
      </div>

      {/* Payment Flow and Fee Breakdown - Side by Side */}
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Payment Flow - 3/5 width */}
        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold mb-4">Payment Flow</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 h-full">
            <PaymentFlowDiagram
              data={calculatedFees}
              config={formData}
            />
          </div>
        </div>

        {/* Fee Breakdown - 2/5 width */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-4">Fee Breakdown</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[50%]"
                    >
                      Fee Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]"
                    >
                      Paid By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">Payment Amount</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      ${formData.paymentAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">
                      Customer
                    </td>
                  </tr>

                  {calculatedFees.stripeFeePercent.amount > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>Processing Fee (%)</div>
                        <div className="text-xs text-gray-500 break-words">
                          {calculatedFees.stripeFeePercent.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                        -${calculatedFees.stripeFeePercent.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500">
                        {calculatedFees.feeHandlingType === "platform"
                          ? "Platform"
                          : "Connected Account"}
                      </td>
                    </tr>
                  )}

                  {/* Fixed Fee row - Always shown to fix table display issue */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>Fixed Fee</div>
                      <div className="text-xs text-gray-500 break-words">
                        {calculatedFees.stripeFeeFixed.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                      -${calculatedFees.stripeFeeFixed.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>

                  {calculatedFees.internationalFee.amount > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>International Fee</div>
                        <div className="text-xs text-gray-500 break-words">
                          {calculatedFees.internationalFee.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                        -${calculatedFees.internationalFee.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500">
                        {calculatedFees.feeHandlingType === "platform"
                          ? "Platform"
                          : "Connected Account"}
                      </td>
                    </tr>
                  )}

                  {/* Application Fee row - Always shown to fix table display issue */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>Application Fee</div>
                      <div className="text-xs text-gray-500 break-words">
                        {calculatedFees.applicationFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                      -${calculatedFees.applicationFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">
                      Connected Account
                    </td>
                  </tr>

                  {calculatedFees.payoutFee.amount > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>Payout Fee</div>
                        <div className="text-xs text-gray-500 break-words">
                          {calculatedFees.payoutFee.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                        -${calculatedFees.payoutFee.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500">
                        {calculatedFees.feeHandlingType === "platform"
                          ? "Platform"
                          : "Connected Account"}
                      </td>
                    </tr>
                  )}

                  {/* Monthly Account Fee row - Always shown to fix table display issue */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>Monthly Account Fee</div>
                      <div className="text-xs text-gray-500 break-words">
                        {calculatedFees.monthlyFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                      -${calculatedFees.monthlyFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>

                  {calculatedFees.instantPayoutFee.amount > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>Instant Payout Fee</div>
                        <div className="text-xs text-gray-500 break-words">
                          {calculatedFees.instantPayoutFee.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                        -${calculatedFees.instantPayoutFee.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500">
                        Connected Account
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Connected Account Receives
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                      ${calculatedFees.connectedAccountAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Platform Receives
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                      ${calculatedFees.platformAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Stripe Receives
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">
                      $
                      {(
                        calculatedFees.stripeFeePercent.amount +
                        calculatedFees.stripeFeeFixed.amount +
                        calculatedFees.internationalFee.amount +
                        calculatedFees.payoutFee.amount +
                        calculatedFees.monthlyFee.amount +
                        calculatedFees.instantPayoutFee.amount
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>

                  <tr className="border-t-2 border-gray-300">
                    <td
                      colSpan="3"
                      className="px-4 py-3"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          Fees paid by Platform:
                        </span>
                        <span className="font-bold">
                          $
                          {calculatedFees.feeHandlingType === "platform"
                            ? (
                                calculatedFees.stripeFeePercent.amount +
                                calculatedFees.stripeFeeFixed.amount +
                                calculatedFees.internationalFee.amount +
                                calculatedFees.payoutFee.amount +
                                calculatedFees.monthlyFee.amount
                              ).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-3"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          Fees paid by Connected Account:
                        </span>
                        <span className="font-bold">
                          $
                          {calculatedFees.feeHandlingType === "stripe"
                            ? (
                                calculatedFees.stripeFeePercent.amount +
                                calculatedFees.stripeFeeFixed.amount +
                                calculatedFees.internationalFee.amount +
                                calculatedFees.instantPayoutFee.amount
                              ).toFixed(2)
                            : calculatedFees.instantPayoutFee.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
