/**
 * Calculate Stripe fees based on the provided parameters
 * 
 * @param {Object} params - Fee calculation parameters
 * @returns {Object} Calculated fee breakdown
 */
export function calculateStripeFees({
  paymentAmount,
  accountType,
  chargeType,
  feeHandling,
  applicationFeeType,
  applicationFee,
  applicationFeePercent,
  stripeFee,
  stripeFeeFixed,
  negotiatedStripeFee,
  includeInternationalFee,
  payoutTiming,
  includeMonthlyFee,
  includeConnectedAccountFee,
}) {
  // Convert to numbers to ensure calculations work properly
  paymentAmount = Number(paymentAmount);
  applicationFee = Number(applicationFee);
  applicationFeePercent = Number(applicationFeePercent);
  stripeFee = Number(stripeFee);
  stripeFeeFixed = Number(stripeFeeFixed);
  
  // Calculate application fee based on type (fixed or percentage)
  const calculatedApplicationFee = applicationFeeType === 'fixed' 
    ? applicationFee 
    : (paymentAmount * (applicationFeePercent / 100));
  
  // Use negotiated fee if provided (for Custom accounts)
  const effectiveStripeFeeRate = negotiatedStripeFee !== null && accountType === 'custom' 
    ? Number(negotiatedStripeFee) 
    : stripeFee;
  
  // Calculate the percentage-based Stripe fee
  const stripeFeePercentAmount = paymentAmount * (effectiveStripeFeeRate / 100);
  const stripeFeeFixedAmount = stripeFeeFixed;
  const stripeFeeAmount = stripeFeePercentAmount + stripeFeeFixedAmount;
  
  // Calculate international fee if applicable (1% extra)
  const internationalFeeAmount = includeInternationalFee ? paymentAmount * 0.01 : 0;
  
  // Calculate payout fee for "Platform handles pricing" model - as per Stripe docs: 0.25% + €0.10 per payout
  // Only applied when the platform handles pricing
  const payoutFeeAmount = feeHandling === 'platform' ? (paymentAmount * 0.0025) + 0.10 : 0;
  const payoutFeeDescription = `0.25% of payment amount ($${paymentAmount.toFixed(2)}) + $0.10 fixed fee per payout transfer`;
  
  // Calculate monthly account fee - as per Stripe docs: €2 per monthly active account
  // Only applied when the platform handles pricing and it's enabled
  const monthlyAccountFee = (includeConnectedAccountFee && feeHandling === 'platform') ? 2 : 0;
  
  // Calculate total stripe fees
  const totalStripeFee = stripeFeeAmount + internationalFeeAmount + payoutFeeAmount + monthlyAccountFee;

  // Different calculations based on charge type and fee handling approach
  let connectedAccountAmount, platformAmount;
  
  if (chargeType === 'direct') {
    // Direct charges - connected account is the merchant of record
    // https://stripe.com/docs/connect/direct-charges
    if (feeHandling === 'stripe') {
      // Stripe handles pricing - fees come from the connected account
      connectedAccountAmount = paymentAmount - stripeFeeAmount - internationalFeeAmount - calculatedApplicationFee;
      platformAmount = calculatedApplicationFee;
    } else {
      // Platform handles pricing - platform absorbs all stripe fees
      // Connected account only has the application fee deducted
      connectedAccountAmount = paymentAmount - calculatedApplicationFee;
      platformAmount = calculatedApplicationFee - stripeFeeAmount - internationalFeeAmount - monthlyAccountFee - payoutFeeAmount;
    }
  } else if (chargeType === 'destination') {
    // Destination charges - platform is the merchant of record
    // https://stripe.com/docs/connect/destination-charges
    if (feeHandling === 'stripe') {
      // Stripe handles pricing - stripe fees are deducted from the destination account amount
      connectedAccountAmount = paymentAmount - stripeFeeAmount - internationalFeeAmount - calculatedApplicationFee;
      platformAmount = calculatedApplicationFee;
    } else {
      // Platform handles pricing - platform absorbs all stripe fees
      // Connected account only has the application fee deducted
      connectedAccountAmount = paymentAmount - calculatedApplicationFee;
      platformAmount = calculatedApplicationFee - stripeFeeAmount - internationalFeeAmount - monthlyAccountFee - payoutFeeAmount;
    }
  } else {
    // Separate charges and transfers - platform charges the customer separately from transfer to connected account
    // https://stripe.com/docs/connect/charges-transfers
    if (feeHandling === 'stripe') {
      // Stripe handles pricing - fees come from the connected account
      connectedAccountAmount = paymentAmount - stripeFeeAmount - internationalFeeAmount;
      platformAmount = 0; // Platform would charge separately
    } else {
      // Platform handles pricing - platform absorbs all fees
      connectedAccountAmount = paymentAmount;
      platformAmount = -stripeFeeAmount - internationalFeeAmount - monthlyAccountFee - payoutFeeAmount; // Negative because platform is covering the fees
    }
  }

  // Additional fees based on account type
  let instantPayoutFee = 0;
  if (accountType === 'express' && payoutTiming === 'instant') {
    // Express accounts with instant payouts have a 1% fee (min $0.50) for instant payouts
    // https://stripe.com/docs/payouts#instant-payouts
    instantPayoutFee = Math.max(connectedAccountAmount * 0.01, 0.5);
    connectedAccountAmount -= instantPayoutFee;
  }

  return {
    // Detailed fee breakdown
    stripeFeePercent: {
      amount: stripeFeePercentAmount,
      description: `${effectiveStripeFeeRate}% of $${paymentAmount.toFixed(2)}`
    },
    stripeFeeFixed: {
      amount: stripeFeeFixedAmount,
      description: `Fixed fee per transaction ($${stripeFeeFixedAmount.toFixed(2)})`
    },
    internationalFee: {
      amount: internationalFeeAmount,
      description: `1% of $${paymentAmount.toFixed(2)} (International card fee)`
    },
    payoutFee: {
      amount: payoutFeeAmount,
      description: payoutFeeDescription
    },
    monthlyFee: {
      amount: monthlyAccountFee,
      description: `$2 per active account monthly (prorated for this transaction)`
    },
    applicationFee: {
      amount: calculatedApplicationFee,
      description: applicationFeeType === 'fixed' 
        ? `Fixed fee of $${applicationFee.toFixed(2)}` 
        : `${applicationFeePercent}% of $${paymentAmount.toFixed(2)}`
    },
    instantPayoutFee: {
      amount: instantPayoutFee,
      description: `1% of connected account amount (min $0.50) for instant payouts`
    },
    
    // Summary amounts
    connectedAccountAmount: connectedAccountAmount,
    platformAmount: platformAmount,
    totalAmount: paymentAmount,
    
    // Fee handling and account types
    feeHandlingType: feeHandling,
    accountType: accountType,
    chargeType: chargeType
  };
}