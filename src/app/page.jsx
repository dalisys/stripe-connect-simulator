"use client";

import { useState } from "react";
import PaymentInputForm from "../components/PaymentInputForm";
import AccountTypeSelector from "../components/AccountTypeSelector";
import ChargeTypeSelector from "../components/ChargeTypeSelector";
import FeeCalculator from "../components/FeeCalculator";
import PaymentFlowDiagram from "../components/PaymentFlowDiagram";

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
  });

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
            <h2 className="text-base font-semibold mb-3">
              Account Configuration
            </h2>
            <div className="space-y-4">
              <AccountTypeSelector
                value={formData.accountType}
                onChange={(value) => handleFormChange({ accountType: value })}
              />
              <ChargeTypeSelector
                value={formData.chargeType}
                onChange={(value) => handleFormChange({ chargeType: value })}
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fee Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Paid By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">Payment Amount</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                    ${formData.paymentAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                    Customer
                  </td>
                </tr>

                {calculatedFees.stripeFeePercent.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Processing Fee (%)</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.stripeFeePercent.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.stripeFeePercent.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>
                )}

                {calculatedFees.stripeFeeFixed.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Fixed Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.stripeFeeFixed.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.stripeFeeFixed.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>
                )}

                {calculatedFees.internationalFee.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>International Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.internationalFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.internationalFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>
                )}

                {calculatedFees.applicationFee.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Application Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.applicationFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.applicationFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      Connected Account
                    </td>
                  </tr>
                )}

                {calculatedFees.payoutFee.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Payout Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.payoutFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.payoutFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>
                )}

                {calculatedFees.monthlyFee.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Monthly Account Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.monthlyFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.monthlyFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      {calculatedFees.feeHandlingType === "platform"
                        ? "Platform"
                        : "Connected Account"}
                    </td>
                  </tr>
                )}

                {calculatedFees.instantPayoutFee.amount > 0 && (
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>Instant Payout Fee</div>
                      <div className="text-xs text-gray-500">
                        {calculatedFees.instantPayoutFee.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                      -${calculatedFees.instantPayoutFee.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      Connected Account
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    Connected Account Receives
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-green-600">
                    ${calculatedFees.connectedAccountAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    Platform Receives
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600">
                    ${calculatedFees.platformAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    Stripe Receives
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-purple-600">
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
                  <td className="px-4 py-3 whitespace-nowrap"></td>
                </tr>

                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan="3"
                    className="px-4 py-3 whitespace-nowrap"
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
                    className="px-4 py-3 whitespace-nowrap"
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
  );
}
